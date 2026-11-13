/*
 * STAAR 2.0 Data Boundary: Backend-Agnostic API Adapter
 * ---------------------------------------------------------------------------
 * Centralizes all network and storage calls behind a single boundary. Routes
 * requests to a remote backend when `VITE_API_BASE_URL` is configured, and
 * falls back to `devSeedData.js` + `sessionStorage` for local development.
 */

import {
  SEED_MODULES,
  SEED_QUESTIONS,
  SEED_SCHOOLS,
  SEED_TEXTS
} from './devSeedData';

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
    responses: {
      english_two: []
    },
    performance: {
      english_two: []
    }
  };
}

function readDevStore() {
  try {
    const raw = sessionStorage.getItem(DEV_STORAGE_KEY);
    if (!raw) return getDefaultDevStore();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultDevStore(),
      ...parsed
    };
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

export async function authenticateUser({ email, pwd }) {
  if (API_BASE_URL) {
    return requestRemote('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ email, pwd })
    });
  }

  const store = readDevStore();
  const normalizedEmail = (email || '').trim().toLowerCase() || 'student@kipp.org';
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

export async function submitQuestionResponse(subject, responseData) {
  if (API_BASE_URL) {
    return requestRemote(`/responses/${subject}`, {
      method: 'POST',
      body: JSON.stringify(responseData)
    });
  }

  const store = readDevStore();
  const subjectResponses = store.responses[subject] || [];
  const filtered = subjectResponses.filter(
    (r) =>
      !(
        r.questionId === Number(responseData.questionId) &&
        r.userId === Number(responseData.userId)
      )
  );

  const newResponse = {
    correctResponse: responseData.correctResponse,
    userResponse: responseData.userResponse,
    totalPoints: Number(responseData.totalPoints),
    pointsEarned: Number(responseData.pointsEarned),
    questionId: Number(responseData.questionId),
    moduleId: Number(responseData.moduleId),
    userId: Number(responseData.userId)
  };

  filtered.push(newResponse);
  store.responses[subject] = filtered;
  writeDevStore(store);

  return { newResponse };
}

export async function fetchResponsesByUserAndModule(subject, userId, moduleId) {
  if (API_BASE_URL) {
    return requestRemote(`/responses/${subject}/${userId}/${moduleId}`);
  }

  const store = readDevStore();
  const responses = (store.responses[subject] || []).filter(
    (r) =>
      r.userId === Number(userId) && r.moduleId === Number(moduleId)
  );

  return { responses };
}

export async function fetchModulePerformanceByUser(subject, moduleId, userId) {
  if (API_BASE_URL) {
    return requestRemote(`/modules/${subject}/${moduleId}/${userId}`);
  }

  const store = readDevStore();
  const userPerformanceData = (store.performance[subject] || []).find(
    (p) =>
      p.moduleId === Number(moduleId) && p.userId === Number(userId)
  );

  return { userPerformanceData };
}

export async function fetchAllPerformanceDataByUser(subject, userId) {
  if (API_BASE_URL) {
    return requestRemote(
      `/modules/${subject}/module_performance/user/${userId}`
    );
  }

  const store = readDevStore();
  const allPerformanceData = (store.performance[subject] || [])
    .filter((p) => p.userId === Number(userId))
    .sort((a, b) => a.moduleId - b.moduleId);

  return { allPerformanceData };
}

export async function submitFirstAttemptPerformance(subject, performanceData) {
  if (API_BASE_URL) {
    return requestRemote(`/modules/${subject}/first_attempt`, {
      method: 'POST',
      body: JSON.stringify(performanceData)
    });
  }

  const store = readDevStore();
  const list = store.performance[subject] || [];
  const firstAttemptSubmission = {
    firstAttempt: Number(performanceData.firstAttempt),
    bestOverall: Number(performanceData.bestOverall),
    moduleId: Number(performanceData.moduleId),
    userId: Number(performanceData.userId)
  };

  const withoutExisting = list.filter(
    (p) =>
      !(
        p.moduleId === firstAttemptSubmission.moduleId &&
        p.userId === firstAttemptSubmission.userId
      )
  );
  withoutExisting.push(firstAttemptSubmission);
  store.performance[subject] = withoutExisting;
  writeDevStore(store);

  return { firstAttemptSubmission };
}

export async function patchModulePerformance(subject, performanceData) {
  if (API_BASE_URL) {
    return requestRemote(`/modules/${subject}/update`, {
      method: 'PATCH',
      body: JSON.stringify(performanceData)
    });
  }

  const store = readDevStore();
  const list = store.performance[subject] || [];
  const target = list.find(
    (p) =>
      p.moduleId === Number(performanceData.moduleId) &&
      p.userId === Number(performanceData.userId)
  );

  if (target) {
    target.bestOverall = Number(performanceData.bestOverall);
    writeDevStore(store);
  }

  return {
    performanceUpdate: target || {
      bestOverall: Number(performanceData.bestOverall),
      moduleId: Number(performanceData.moduleId),
      userId: Number(performanceData.userId)
    }
  };
}
