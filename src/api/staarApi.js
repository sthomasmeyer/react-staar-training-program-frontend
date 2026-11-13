/*
 * STAAR 2.0 Data Boundary: Backend-Agnostic API Adapter
 * ---------------------------------------------------------------------------
 * Single source of truth for authentication, curriculum lookup, attempt
 * lifecycle, canonical response scoring, and derived student ledger state.
 * Routes to `VITE_API_BASE_URL` when set, otherwise falls back to
 * `devSeedData.js` + `sessionStorage`.
 */

import {
  SEED_MODULES,
  SEED_QUESTIONS,
  SEED_SCHOOLS,
  SEED_TEXTS
} from './devSeedData';
import { normalizeEpochMs } from '../utils/time';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || null;

export const IS_REMOTE_API = Boolean(API_BASE_URL);

const DEV_STORAGE_KEY = 'staar-training-dev-store-v1';

function getDefaultDevStore() {
  return {
    users: [
      {
        id: 1,
        email: 'student@kipp.org',
        schoolId: 1,
        adminAccount: false
      }
    ],
    attempts: {
      english_two: []
    },
    performance: {
      english_two: []
    }
  };
}

let attemptIdSeq = 0;

function createAttemptId(userId, moduleId) {
  const token =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : `${++attemptIdSeq}-${Math.random().toString(36).slice(2, 8)}`;
  return `att-${userId}-${moduleId}-${token}`;
}

// WHY: Coerce legacy ISO-string timestamps at the storage boundary into
// canonical 64-bit integer EpochMs and drop duplicate string keys.
function normalizeAttemptRecord(attempt, fallbackNowMs) {
  const startedAtMs =
    normalizeEpochMs(attempt.startedAtMs ?? attempt.startedAt) ?? fallbackNowMs;
  const updatedAtMs =
    normalizeEpochMs(attempt.updatedAtMs ?? attempt.updatedAt) ?? startedAtMs;
  const submittedAtMs =
    normalizeEpochMs(attempt.submittedAtMs ?? attempt.submittedAt) ??
    (attempt.status === 'completed' ? updatedAtMs : null);

  const normalizedResponses = {};
  for (const [qId, resp] of Object.entries(attempt.responses || {})) {
    const { updatedAt: legacyRespUpdatedAt, ...restResp } = resp;
    normalizedResponses[qId] = {
      ...restResp,
      updatedAtMs:
        normalizeEpochMs(resp.updatedAtMs ?? legacyRespUpdatedAt) ?? updatedAtMs
    };
  }

  const {
    startedAt: _legacyStartedAt,
    updatedAt: _legacyUpdatedAt,
    submittedAt: _legacySubmittedAt,
    ...rest
  } = attempt;

  return {
    ...rest,
    startedAtMs,
    updatedAtMs,
    submittedAtMs,
    responses: normalizedResponses
  };
}

// WHY: Preserve progress for existing sessions that wrote the earlier flat
// `performance` array before `attempts` became the canonical record.
function migrateLegacyPerformance(store, subject, nowMs = Date.now()) {
  const attempts = store.attempts?.[subject] || [];
  const legacyRows = store.performance?.[subject] || [];

  if (attempts.length > 0 || legacyRows.length === 0) {
    return attempts.map((attempt) => normalizeAttemptRecord(attempt, nowMs));
  }

  return legacyRows.map((row, idx) => ({
    id: `att-legacy-${row.userId}-${row.moduleId}-${idx + 1}`,
    attemptNumber: 1,
    userId: Number(row.userId),
    moduleId: Number(row.moduleId),
    status: 'completed',
    startedAtMs: nowMs,
    updatedAtMs: nowMs,
    submittedAtMs: nowMs,
    totalPossiblePoints: 0,
    totalPointsEarned: 0,
    scoreRatio: Number(row.firstAttempt),
    responses: {}
  }));
}

function readDevStore(nowMs = Date.now()) {
  try {
    const raw = sessionStorage.getItem(DEV_STORAGE_KEY);
    if (!raw) return getDefaultDevStore();
    const parsed = JSON.parse(raw);
    const merged = {
      ...getDefaultDevStore(),
      ...parsed,
      attempts: {
        ...getDefaultDevStore().attempts,
        ...parsed.attempts
      }
    };
    merged.attempts.english_two = migrateLegacyPerformance(
      merged,
      'english_two',
      nowMs
    );
    return merged;
  } catch {
    return getDefaultDevStore();
  }
}

function writeDevStore(store) {
  try {
    sessionStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage write errors in restricted browsing contexts.
  }
}

async function requestRemote(path, options = {}) {
  const token = sessionStorage.getItem('staar-training-platform-jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`STAAR API request failed (${response.status}): ${path}`);
  }

  return response.json();
}

function setsEqual(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, idx) => value === sortedB[idx]);
}

export function scoreQuestionResponse(questionData, userResponse) {
  const correct = Array.isArray(questionData.correctAnswer)
    ? questionData.correctAnswer
    : [];
  const answer = Array.isArray(userResponse) ? userResponse : [];
  const maxPoints = Number(questionData.totalPossiblePoints) || 1;

  switch (questionData.questionType) {
    case 'two-part': {
      const partOne = answer[0] === correct[0] ? 1 : 0;
      const partTwo = answer[1] === correct[1] ? 1 : 0;
      return {
        totalPoints: maxPoints,
        pointsEarned: partOne + partTwo
      };
    }
    case 'multi-select':
    case 'table-style':
      return {
        totalPoints: maxPoints,
        pointsEarned: setsEqual(answer, correct) ? maxPoints : 0
      };
    case 'multiple-choice':
    case 'text-entry':
    default:
      return {
        totalPoints: maxPoints,
        pointsEarned: answer[0] === correct[0] ? maxPoints : 0
      };
  }
}

function summarizeModuleAttempts(moduleAttempts, moduleId) {
  const completedAttempts = moduleAttempts
    .filter((a) => a.status === 'completed')
    .sort((a, b) => a.attemptNumber - b.attemptNumber);

  const activeDraft =
    moduleAttempts.find((a) => a.status === 'in_progress') || null;

  if (completedAttempts.length === 0) {
    return {
      moduleId: Number(moduleId),
      attemptCount: 0,
      firstAttempt: null,
      latestAttempt: null,
      bestOverall: null,
      completedAttempts: [],
      activeDraft
    };
  }

  const firstAttempt = Number(completedAttempts[0].scoreRatio);
  const latestAttempt = Number(
    completedAttempts[completedAttempts.length - 1].scoreRatio
  );
  const bestOverall = Math.max(
    ...completedAttempts.map((a) => Number(a.scoreRatio))
  );

  return {
    moduleId: Number(moduleId),
    attemptCount: completedAttempts.length,
    firstAttempt,
    latestAttempt,
    bestOverall,
    completedAttempts,
    activeDraft
  };
}

function deriveTeksMastery(completedModules) {
  const standards = {};

  const ensureStandard = (code) => {
    if (!standards[code]) {
      standards[code] = {
        standard: code,
        currentEarned: 0,
        currentPossible: 0,
        baselineEarned: 0,
        baselinePossible: 0,
        totalAttemptsChecked: 0,
        missedOnLatestCount: 0
      };
    }
    return standards[code];
  };

  for (const modSummary of completedModules) {
    const attempts = modSummary.completedAttempts || [];
    if (attempts.length === 0) continue;

    const baselineAttempt = attempts[0];
    const latestAttempt = attempts[attempts.length - 1];

    for (const resp of Object.values(baselineAttempt.responses || {})) {
      for (const std of resp.alignedStandards || []) {
        const entry = ensureStandard(std);
        entry.baselineEarned += Number(resp.pointsEarned || 0);
        entry.baselinePossible += Number(resp.totalPoints || 1);
      }
    }

    for (const resp of Object.values(latestAttempt.responses || {})) {
      const earned = Number(resp.pointsEarned || 0);
      const possible = Number(resp.totalPoints || 1);
      for (const std of resp.alignedStandards || []) {
        const entry = ensureStandard(std);
        entry.currentEarned += earned;
        entry.currentPossible += possible;
        if (earned < possible) {
          entry.missedOnLatestCount += 1;
        }
      }
    }

    for (const attempt of attempts) {
      for (const resp of Object.values(attempt.responses || {})) {
        for (const std of resp.alignedStandards || []) {
          ensureStandard(std).totalAttemptsChecked += 1;
        }
      }
    }
  }

  return Object.values(standards)
    .filter((item) => item.currentPossible > 0)
    .map((item) => ({
      standard: item.standard,
      currentEarned: item.currentEarned,
      currentPossible: item.currentPossible,
      currentAccuracy: item.currentEarned / item.currentPossible,
      baselineAccuracy:
        item.baselinePossible > 0
          ? item.baselineEarned / item.baselinePossible
          : null,
      totalAttemptsChecked: item.totalAttemptsChecked,
      missedOnLatestCount: item.missedOnLatestCount
    }))
    .sort((a, b) => {
      if (a.currentAccuracy !== b.currentAccuracy) {
        return a.currentAccuracy - b.currentAccuracy;
      }
      return a.standard.localeCompare(b.standard);
    });
}

export function deriveUserLedger(attemptsList, userId) {
  const numericUserId = Number(userId);
  const userAttempts = attemptsList.filter((a) => a.userId === numericUserId);

  const groupedByModule = {};
  for (const attempt of userAttempts) {
    const modId = Number(attempt.moduleId);
    if (!groupedByModule[modId]) {
      groupedByModule[modId] = [];
    }
    groupedByModule[modId].push(attempt);
  }

  const byModule = {};
  for (const [modId, list] of Object.entries(groupedByModule)) {
    byModule[modId] = summarizeModuleAttempts(list, modId);
  }

  const completedModules = Object.values(byModule)
    .filter((summary) => summary.attemptCount > 0)
    .sort((a, b) => a.moduleId - b.moduleId);

  const inProgressDrafts = Object.values(byModule)
    .map((summary) => summary.activeDraft)
    .filter(
      (draft) => draft && Object.keys(draft.responses || {}).length > 0
    )
    .sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));

  const completedModuleCount = completedModules.length;
  const totalCompletedAttempts = completedModules.reduce(
    (sum, mod) => sum + mod.attemptCount,
    0
  );

  const avgFirstAttempt =
    completedModuleCount > 0
      ? (completedModules.reduce((sum, mod) => sum + mod.firstAttempt, 0) /
          completedModuleCount) *
        100
      : null;

  const avgBestOverall =
    completedModuleCount > 0
      ? (completedModules.reduce((sum, mod) => sum + mod.bestOverall, 0) /
          completedModuleCount) *
        100
      : null;

  const teksMastery = deriveTeksMastery(completedModules);

  return {
    byModule,
    completedModules,
    inProgressDrafts,
    teksMastery,
    totals: {
      completedModuleCount,
      totalCompletedAttempts,
      avgFirstAttempt,
      avgBestOverall
    }
  };
}

export async function authenticateUser({ email, pwd }) {
  if (API_BASE_URL) {
    return requestRemote('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ email, pwd })
    });
  }

  const store = readDevStore();
  const normalizedEmail =
    (email || '').trim().toLowerCase() || 'student@kipp.org';
  let user = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (!user) {
    user = {
      id: store.users.length + 1,
      email: normalizedEmail,
      schoolId: 1,
      adminAccount: false
    };
    store.users.push(user);
    writeDevStore(store);
  }

  return {
    user,
    token: `dev-jwt-token-${user.id}`
  };
}

export async function registerUser({ email, schoolId, pwd }) {
  if (API_BASE_URL) {
    return requestRemote('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, schoolId, pwd })
    });
  }

  const store = readDevStore();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const existing = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    return {
      newUser: existing,
      token: `dev-jwt-token-${existing.id}`
    };
  }

  const newUser = {
    id: store.users.length + 1,
    email: normalizedEmail || `student${store.users.length + 1}@kipp.org`,
    schoolId: Number(schoolId) || 1,
    adminAccount: false
  };

  store.users.push(newUser);
  writeDevStore(store);

  return {
    newUser,
    token: `dev-jwt-token-${newUser.id}`
  };
}

export async function fetchUserById(userId) {
  if (API_BASE_URL) {
    return requestRemote(`/users/${userId}`);
  }

  const store = readDevStore();
  const numericId = Number(userId);
  const user =
    store.users.find((u) => u.id === numericId) || store.users[0];

  return { user };
}

export async function fetchSchools() {
  if (API_BASE_URL) {
    return requestRemote('/schools/');
  }

  return { schools: SEED_SCHOOLS };
}

export async function fetchModulesBySubject(subject) {
  if (API_BASE_URL) {
    return requestRemote(`/modules/${subject}`);
  }

  const modules = (SEED_MODULES[subject] || []).map(({ id, moduleName }) => ({
    id,
    moduleName
  }));

  return { modules };
}

export async function fetchModuleBySubjectAndId(subject, id) {
  if (API_BASE_URL) {
    return requestRemote(`/modules/${subject}/${id}`);
  }

  const numericId = Number(id);
  const targetModule = (SEED_MODULES[subject] || [])
    .filter((m) => m.id === numericId)
    .map(({ id: modId, moduleName }) => ({ id: modId, moduleName }));

  return { targetModule };
}

export async function fetchTextBySubjectAndModuleId(subject, moduleId) {
  if (API_BASE_URL) {
    return requestRemote(`/texts/${subject}/${moduleId}`);
  }

  const numericId = Number(moduleId);
  const text =
    (SEED_TEXTS[subject] || []).find((t) => t.moduleId === numericId) || null;

  return { text };
}

export async function fetchQuestionsByModuleId(moduleId) {
  if (API_BASE_URL) {
    return requestRemote(`/questions/${moduleId}`);
  }

  const numericId = Number(moduleId);
  const questions = SEED_QUESTIONS.filter((q) => q.moduleId === numericId);

  return { questions };
}

export async function fetchModuleAttemptState(subject, moduleId, userId) {
  if (API_BASE_URL) {
    return requestRemote(`/attempts/${subject}/${userId}/${moduleId}`);
  }

  const store = readDevStore();
  const numericModuleId = Number(moduleId);
  const numericUserId = Number(userId);
  const moduleAttempts = (store.attempts[subject] || []).filter(
    (a) => a.userId === numericUserId && a.moduleId === numericModuleId
  );

  const summary = summarizeModuleAttempts(moduleAttempts, numericModuleId);

  return {
    activeDraft: summary.activeDraft,
    completedAttempts: summary.completedAttempts,
    summary
  };
}

// WHY: Materialize a new `in_progress` attempt strictly when the student saves
// their first answer, avoiding phantom 0-answer attempts on simple page views.
export async function saveAttemptAnswer(
  subject,
  {
    moduleId,
    userId,
    questionData,
    userResponse,
    questionCount,
    nowMs = Date.now()
  }
) {
  if (API_BASE_URL) {
    return requestRemote(`/attempts/${subject}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        moduleId,
        userId,
        questionId: questionData.id,
        userResponse,
        questionCount
      })
    });
  }

  const stampMs = normalizeEpochMs(nowMs) ?? Date.now();
  const store = readDevStore(stampMs);
  const list = store.attempts[subject] || [];
  const numericModuleId = Number(moduleId);
  const numericUserId = Number(userId);
  const knownQuestionCount =
    Number(questionCount) ||
    SEED_QUESTIONS.filter((q) => q.moduleId === numericModuleId).length;

  let draft = list.find(
    (a) =>
      a.userId === numericUserId &&
      a.moduleId === numericModuleId &&
      a.status === 'in_progress'
  );

  if (!draft) {
    const completedCount = list.filter(
      (a) =>
        a.userId === numericUserId &&
        a.moduleId === numericModuleId &&
        a.status === 'completed'
    ).length;

    draft = {
      id: createAttemptId(numericUserId, numericModuleId),
      attemptNumber: completedCount + 1,
      userId: numericUserId,
      moduleId: numericModuleId,
      status: 'in_progress',
      questionCount: knownQuestionCount,
      startedAtMs: stampMs,
      updatedAtMs: stampMs,
      submittedAtMs: null,
      totalPossiblePoints: 0,
      totalPointsEarned: 0,
      scoreRatio: null,
      responses: {}
    };
    list.push(draft);
  } else if (knownQuestionCount > 0) {
    draft.questionCount = knownQuestionCount;
  }

  const { totalPoints, pointsEarned } = scoreQuestionResponse(
    questionData,
    userResponse
  );

  draft.responses[String(questionData.id)] = {
    questionId: Number(questionData.id),
    alignedStandards: questionData.alignedStandards || [],
    correctResponse: questionData.correctAnswer,
    userResponse,
    totalPoints,
    pointsEarned,
    updatedAtMs: stampMs
  };
  draft.updatedAtMs = stampMs;

  store.attempts[subject] = list;
  writeDevStore(store);

  return { attempt: draft };
}

export async function completeModuleAttempt(
  subject,
  { attemptId, moduleId, userId, totalPossiblePoints, nowMs = Date.now() }
) {
  if (API_BASE_URL) {
    return requestRemote(`/attempts/${subject}/submit`, {
      method: 'POST',
      body: JSON.stringify({ attemptId, moduleId, userId })
    });
  }

  const stampMs = normalizeEpochMs(nowMs) ?? Date.now();
  const store = readDevStore(stampMs);
  const list = store.attempts[subject] || [];
  const numericModuleId = Number(moduleId);
  const numericUserId = Number(userId);

  const draft = list.find(
    (a) =>
      a.userId === numericUserId &&
      a.moduleId === numericModuleId &&
      a.status === 'in_progress' &&
      (!attemptId || a.id === attemptId)
  );

  if (!draft) {
    throw new Error(
      `No active attempt found for user ${numericUserId}, module ${numericModuleId}`
    );
  }

  const moduleQuestions = SEED_QUESTIONS.filter(
    (q) => q.moduleId === numericModuleId
  );
  const canonicalMaxPoints =
    moduleQuestions.length > 0
      ? moduleQuestions.reduce(
          (sum, q) => sum + (Number(q.totalPossiblePoints) || 1),
          0
        )
      : Number(totalPossiblePoints) || 0;

  const responseValues = Object.values(draft.responses || {});
  const totalPointsEarned = responseValues.reduce(
    (sum, item) => sum + Number(item.pointsEarned || 0),
    0
  );
  const scoreRatio =
    canonicalMaxPoints > 0 ? totalPointsEarned / canonicalMaxPoints : 0;

  draft.status = 'completed';
  draft.updatedAtMs = stampMs;
  draft.submittedAtMs = stampMs;
  draft.totalPossiblePoints = canonicalMaxPoints;
  draft.totalPointsEarned = totalPointsEarned;
  draft.scoreRatio = scoreRatio;

  store.attempts[subject] = list;
  writeDevStore(store);

  const summary = summarizeModuleAttempts(
    list.filter(
      (a) => a.userId === numericUserId && a.moduleId === numericModuleId
    ),
    numericModuleId
  );

  return {
    completedAttempt: draft,
    summary
  };
}

export async function discardActiveAttempt(
  subject,
  { attemptId, moduleId, userId }
) {
  if (API_BASE_URL) {
    return requestRemote(`/attempts/${subject}/draft`, {
      method: 'DELETE',
      body: JSON.stringify({ attemptId, moduleId, userId })
    });
  }

  const store = readDevStore();
  const list = store.attempts[subject] || [];
  const numericModuleId = Number(moduleId);
  const numericUserId = Number(userId);

  store.attempts[subject] = list.filter(
    (a) =>
      !(
        a.userId === numericUserId &&
        a.moduleId === numericModuleId &&
        a.status === 'in_progress' &&
        (!attemptId || a.id === attemptId)
      )
  );
  writeDevStore(store);

  const remaining = store.attempts[subject].filter(
    (a) => a.userId === numericUserId && a.moduleId === numericModuleId
  );
  const summary = summarizeModuleAttempts(remaining, numericModuleId);

  return {
    activeDraft: null,
    completedAttempts: summary.completedAttempts,
    summary
  };
}

export async function fetchUserLedger(subject, userId) {
  if (API_BASE_URL) {
    return requestRemote(`/attempts/${subject}/ledger/${userId}`);
  }

  const store = readDevStore();
  return deriveUserLedger(store.attempts[subject] || [], userId);
}

export async function fetchAttemptById(subject, moduleId, attemptId, userId) {
  if (API_BASE_URL) {
    return requestRemote(
      `/attempts/${subject}/${userId}/${moduleId}/${attemptId}`
    );
  }

  const store = readDevStore();
  const numericUserId = Number(userId);
  const numericModuleId = Number(moduleId);
  const target = (store.attempts[subject] || []).find(
    (a) =>
      a.id === String(attemptId) &&
      a.userId === numericUserId &&
      a.moduleId === numericModuleId &&
      a.status === 'completed'
  );

  return { attempt: target || null };
}
