import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import useUserInfoById from '../hooks/useUserInfoById';
import useSchools from '../hooks/useSchools';
import useModuleList from '../hooks/useModuleList';
import useUserLedger from '../hooks/useUserLedger';
import { discardActiveAttempt } from '../api/staarApi';
import { formatTimestampMs } from '../utils/time';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const userId = sessionStorage.getItem('staar-training-platform-user-id');
  const navigate = useNavigate();

  const [expandedModules, setExpandedModules] = useState({});
  const [confirmDiscardModuleId, setConfirmDiscardModuleId] = useState(null);

  const userInfo = useUserInfoById(userId);
  const schools = useSchools();
  const modulesData = useModuleList('english_two');
  const { ledger, reload: reloadLedger } = useUserLedger('english_two', userId);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (!userInfo || !ledger || !schools || !modulesData) {
    return (
      <div className='UserProfile-shell'>
        <NavBar />
        <main className='UserProfile'>
          <p className='UserProfile-loading instrument-badge'>
            LOADING STUDENT LEDGER…
          </p>
        </main>
      </div>
    );
  }

  const matchedSchool = schools.schools.find(
    (s) => s.id === Number(userInfo.user.schoolId)
  );
  const schoolName =
    matchedSchool?.schoolName || schools.schools[0]?.schoolName || 'N/A';

  const moduleNameMap = {};
  for (const mod of modulesData.modules) {
    moduleNameMap[mod.id] = mod.moduleName;
  }

  const { completedModules, inProgressDrafts, teksMastery, totals } = ledger;

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleDiscardDraft = async (draft) => {
    if (confirmDiscardModuleId !== draft.moduleId) {
      setConfirmDiscardModuleId(draft.moduleId);
      return;
    }

    await discardActiveAttempt('english_two', {
      attemptId: draft.id,
      moduleId: draft.moduleId,
      userId
    });
    setConfirmDiscardModuleId(null);
    await reloadLedger();
  };

  return (
    <div className='UserProfile-shell'>
      <NavBar />
      <main className='UserProfile'>
        <section className='UserProfile-card'>
          <div className='UserProfile-header'>
            <div className='UserProfile-identity'>
              <span className='UserProfile-eyebrow instrument-badge'>
                STUDENT ACCOUNT // ENGLISH II
              </span>
              <h1 className='UserProfile-email'>{userInfo.user.email}</h1>
              <p className='UserProfile-school'>{schoolName}</p>
            </div>

            <button
              type='button'
              className='UserProfile-logout instrument-badge'
              onClick={logout}
            >
              LOG OUT
            </button>
          </div>

          <div className='UserProfile-metrics'>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                MODULES COMPLETED
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {totals.completedModuleCount} / {modulesData.modules.length}
              </span>
            </div>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                COMPLETED ATTEMPTS
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {totals.totalCompletedAttempts}
              </span>
            </div>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                AVG FIRST ATTEMPT
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {totals.avgFirstAttempt !== null
                  ? `${totals.avgFirstAttempt.toFixed(1)}%`
                  : '--'}
              </span>
            </div>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                AVG BEST SCORE
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {totals.avgBestOverall !== null
                  ? `${totals.avgBestOverall.toFixed(1)}%`
                  : '--'}
              </span>
            </div>
          </div>

          {inProgressDrafts.length > 0 && (
            <div className='UserProfile-drafts'>
              <h2 className='UserProfile-section-title instrument-badge'>
                CONTINUE WHERE YOU LEFT OFF
              </h2>
              <div className='UserProfile-draft-list'>
                {inProgressDrafts.map((draft) => {
                  const savedCount = Object.keys(draft.responses || {}).length;
                  const totalLabel = draft.questionCount
                    ? `${savedCount} / ${draft.questionCount}`
                    : `${savedCount}`;
                  const isConfirmingDiscard =
                    confirmDiscardModuleId === draft.moduleId;

                  return (
                    <div key={draft.id} className='UserProfile-draft-row'>
                      <div className='UserProfile-draft-info'>
                        <div className='UserProfile-draft-heading'>
                          <span className='UserProfile-row-id instrument-badge'>
                            MOD {String(draft.moduleId).padStart(2, '0')}
                          </span>
                          <span className='UserProfile-row-name'>
                            {moduleNameMap[draft.moduleId] ||
                              `Module ${draft.moduleId}`}
                          </span>
                        </div>
                        <span className='UserProfile-draft-meta instrument-badge'>
                          ATTEMPT #{draft.attemptNumber} · {totalLabel} SAVED ·{' '}
                          {formatTimestampMs(draft.updatedAtMs, {
                            fallback: 'Just now'
                          })}
                        </span>
                      </div>

                      <div className='UserProfile-draft-actions'>
                        {isConfirmingDiscard ? (
                          <>
                            <button
                              type='button'
                              className='UserProfile-draft-discard is-confirm instrument-badge'
                              onClick={() => handleDiscardDraft(draft)}
                            >
                              CONFIRM DISCARD
                            </button>
                            <button
                              type='button'
                              className='UserProfile-draft-discard instrument-badge'
                              onClick={() => setConfirmDiscardModuleId(null)}
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <button
                            type='button'
                            className='UserProfile-draft-discard instrument-badge'
                            onClick={() => handleDiscardDraft(draft)}
                          >
                            DISCARD
                          </button>
                        )}
                        <button
                          type='button'
                          className='UserProfile-draft-resume instrument-badge'
                          onClick={() =>
                            navigate(`/english_two/modules/${draft.moduleId}`)
                          }
                        >
                          RESUME →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className='UserProfile-ledger'>
            <h2 className='UserProfile-section-title instrument-badge'>
              MODULE PERFORMANCE LEDGER
            </h2>

            {completedModules.length === 0 ? (
              <div className='UserProfile-empty'>
                <p>
                  {inProgressDrafts.length > 0
                    ? 'No completed module attempts recorded yet. Finish your in-progress draft above to post your first official score.'
                    : 'You haven’t submitted a completed module yet. Complete any English II module to record every attempt, first-attempt baseline, and personal best.'}
                </p>
                {inProgressDrafts.length === 0 && (
                  <button
                    type='button'
                    className='UserProfile-browse-btn instrument-badge'
                    onClick={() => navigate('/english_two/modules')}
                  >
                    BROWSE MODULES →
                  </button>
                )}
              </div>
            ) : (
              <div className='UserProfile-table-wrap'>
                <div className='UserProfile-table-head instrument-badge'>
                  <span>MODULE</span>
                  <span className='is-right'>ATTEMPTS</span>
                  <span className='is-right'>FIRST</span>
                  <span className='is-right'>LATEST</span>
                  <span className='is-right'>BEST</span>
                  <span aria-hidden='true' />
                </div>

                {completedModules.map((data) => {
                  const firstPct = (Number(data.firstAttempt) * 100).toFixed(1);
                  const latestPct = (Number(data.latestAttempt) * 100).toFixed(
                    1
                  );
                  const bestPct = (Number(data.bestOverall) * 100).toFixed(1);
                  const isExpanded = Boolean(expandedModules[data.moduleId]);

                  return (
                    <div key={data.moduleId} className='UserProfile-ledger-group'>
                      <button
                        type='button'
                        className={`UserProfile-table-row ${
                          isExpanded ? 'is-expanded' : ''
                        }`}
                        aria-expanded={isExpanded}
                        onClick={() => toggleModuleExpand(data.moduleId)}
                      >
                        <div className='UserProfile-row-module'>
                          <span className='UserProfile-row-id instrument-badge'>
                            MOD {String(data.moduleId).padStart(2, '0')}
                          </span>
                          <span className='UserProfile-row-name'>
                            {moduleNameMap[data.moduleId] ||
                              `Module ${data.moduleId}`}
                          </span>
                        </div>
                        <span className='UserProfile-row-num numeric-readout'>
                          {data.attemptCount}
                        </span>
                        <span className='UserProfile-row-num numeric-readout'>
                          {firstPct}%
                        </span>
                        <span className='UserProfile-row-num numeric-readout'>
                          {latestPct}%
                        </span>
                        <span className='UserProfile-row-num UserProfile-row-num--best numeric-readout'>
                          {bestPct}%
                        </span>
                        <span
                          className={`UserProfile-row-chevron ${
                            isExpanded ? 'is-expanded' : ''
                          }`}
                          aria-hidden='true'
                        >
                          ▸
                        </span>
                      </button>

                      {isExpanded && (
                        <div className='UserProfile-history'>
                          <div className='UserProfile-history-head'>
                            <span className='UserProfile-history-label instrument-badge'>
                              ATTEMPT LOG ({data.attemptCount})
                            </span>
                            <button
                              type='button'
                              className='UserProfile-retake-btn instrument-badge'
                              onClick={() =>
                                navigate(`/english_two/modules/${data.moduleId}`)
                              }
                            >
                              {data.activeDraft
                                ? `RESUME ATTEMPT #${data.activeDraft.attemptNumber} →`
                                : `START ATTEMPT #${data.attemptCount + 1} →`}
                            </button>
                          </div>

                          <ul className='UserProfile-history-list'>
                            {data.completedAttempts.map((attempt, idx) => {
                              const scorePct = (
                                Number(attempt.scoreRatio) * 100
                              ).toFixed(1);
                              const isFirst = idx === 0;
                              const isBest =
                                Number(attempt.scoreRatio) ===
                                  Number(data.bestOverall) &&
                                Number(attempt.scoreRatio) > 0;
                              const deltaFromFirst =
                                !isFirst
                                  ? (Number(attempt.scoreRatio) -
                                      Number(data.firstAttempt)) *
                                    100
                                  : null;

                              const hasResponses =
                                Object.keys(attempt.responses || {}).length > 0;

                              return (
                                <li
                                  key={attempt.id}
                                  className='UserProfile-history-item'
                                >
                                  <div className='UserProfile-history-meta'>
                                    <span className='UserProfile-history-num instrument-badge'>
                                      ATTEMPT #{attempt.attemptNumber}
                                    </span>
                                    <span className='UserProfile-history-date'>
                                      {formatTimestampMs(attempt.submittedAtMs, {
                                        fallback: 'Just now'
                                      })}
                                    </span>
                                    {isFirst && (
                                      <span className='UserProfile-tag instrument-badge'>
                                        BASELINE
                                      </span>
                                    )}
                                    {isBest && (
                                      <span className='UserProfile-tag UserProfile-tag--best instrument-badge'>
                                        PERSONAL BEST
                                      </span>
                                    )}
                                  </div>

                                  <div className='UserProfile-history-scores numeric-readout'>
                                    {attempt.totalPossiblePoints > 0 && (
                                      <span className='UserProfile-history-pts'>
                                        {attempt.totalPointsEarned}/
                                        {attempt.totalPossiblePoints} pts
                                      </span>
                                    )}
                                    {deltaFromFirst !== null &&
                                      deltaFromFirst !== 0 && (
                                        <span
                                          className={`UserProfile-history-delta ${
                                            deltaFromFirst > 0
                                              ? 'is-up'
                                              : 'is-down'
                                          }`}
                                        >
                                          {deltaFromFirst > 0 ? '+' : ''}
                                          {deltaFromFirst.toFixed(1)}%
                                        </span>
                                      )}
                                    <span className='UserProfile-history-pct'>
                                      {scorePct}%
                                    </span>
                                    {hasResponses ? (
                                      <button
                                        type='button'
                                        className='UserProfile-inspect-btn instrument-badge'
                                        onClick={() =>
                                          navigate(
                                            `/english_two/modules/${data.moduleId}/attempts/${attempt.id}`
                                          )
                                        }
                                      >
                                        REVIEW →
                                      </button>
                                    ) : (
                                      <span className='UserProfile-tag instrument-badge'>
                                        LEGACY IMPORT
                                      </span>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {teksMastery.length > 0 && (
            <div className='UserProfile-teks'>
              <div className='UserProfile-teks-head'>
                <h2 className='UserProfile-section-title instrument-badge'>
                  TEKS STANDARDS MASTERY
                </h2>
                <span className='UserProfile-teks-caption instrument-badge'>
                  SORTED BY FOCUS PRIORITY · LATEST COMPLETED ATTEMPT PER MODULE
                </span>
              </div>

              <div className='UserProfile-teks-grid'>
                {teksMastery.map((item) => {
                  const pct = Math.round(item.currentAccuracy * 100);
                  const baselinePct =
                    item.baselineAccuracy !== null
                      ? Math.round(item.baselineAccuracy * 100)
                      : null;
                  const tone =
                    pct >= 80 ? 'strong' : pct >= 50 ? 'mid' : 'focus';

                  return (
                    <div
                      key={item.standard}
                      className={`UserProfile-teks-card is-${tone}`}
                    >
                      <div className='UserProfile-teks-top'>
                        <span className='UserProfile-teks-code instrument-badge'>
                          {item.standard}
                        </span>
                        <span className='UserProfile-teks-pct numeric-readout'>
                          {pct}%
                        </span>
                      </div>

                      <div
                        className='UserProfile-teks-track'
                        role='progressbar'
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${item.standard} mastery ${pct}%`}
                      >
                        <div
                          className='UserProfile-teks-fill'
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className='UserProfile-teks-meta instrument-badge'>
                        <span>
                          {item.currentEarned} / {item.currentPossible} PTS
                        </span>
                        {baselinePct !== null && (
                          <span>COLD READ {baselinePct}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
