import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import Text from './Text';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import useModuleBySubjectAndId from '../hooks/useModuleBySubjectAndId';
import useModuleAttempt from '../hooks/useModuleAttempt';
import useModuleAttemptState from '../hooks/useModuleAttemptState';
import { formatTimestampMs } from '../utils/time';
import '../styles/AttemptReview.css';

function AnswerBox({ label, text, tone }) {
  return (
    <div className={`AttemptReview-answer-box is-${tone}`}>
      <span className='AttemptReview-answer-label instrument-badge'>
        {label}
      </span>
      <p className='AttemptReview-answer-text'>{text}</p>
    </div>
  );
}

function MultiSelectCompare({ question, userResponse, correctResponse }) {
  const userSet = new Set(userResponse);
  const correctSet = new Set(correctResponse);

  const relevantChoices = question.answerChoices.filter(
    (choice) => userSet.has(choice) || correctSet.has(choice)
  );

  return (
    <ul className='AttemptReview-multi-list'>
      {relevantChoices.map((choice) => {
        const picked = userSet.has(choice);
        const expected = correctSet.has(choice);

        let tag = 'MISSED · REQUIRED';
        let tone = 'required';
        if (picked && expected) {
          tag = 'YOUR PICK · CORRECT';
          tone = 'correct';
        } else if (picked && !expected) {
          tag = 'YOUR PICK · INCORRECT';
          tone = 'wrong';
        }

        return (
          <li key={choice} className={`AttemptReview-multi-item is-${tone}`}>
            <span className='AttemptReview-multi-tag instrument-badge'>
              {tag}
            </span>
            <span className='AttemptReview-multi-text'>{choice}</span>
          </li>
        );
      })}
    </ul>
  );
}

function TwoPartCompare({ question, userResponse, correctResponse }) {
  return (
    <div className='AttemptReview-twopart'>
      {[0, 1].map((partIdx) => {
        const userAns = userResponse[partIdx] || '(No response)';
        const expectedAns = correctResponse[partIdx];
        const isMatch = userAns === expectedAns;

        return (
          <div key={partIdx} className='AttemptReview-part-block'>
            <div className='AttemptReview-part-header'>
              <span className='AttemptReview-part-pill instrument-badge'>
                PART {partIdx === 0 ? 'A' : 'B'}
              </span>
              <span
                className={`AttemptReview-part-pts instrument-badge ${
                  isMatch ? 'is-correct' : 'is-wrong'
                }`}
              >
                {isMatch ? '1 / 1 PT' : '0 / 1 PT'}
              </span>
            </div>
            <p className='AttemptReview-part-prompt'>
              {question.question[partIdx]}
            </p>
            <div className='AttemptReview-answer-stack'>
              <AnswerBox
                label={isMatch ? 'YOUR ANSWER · CORRECT' : 'YOUR ANSWER'}
                text={userAns}
                tone={isMatch ? 'correct' : 'wrong'}
              />
              {!isMatch && (
                <AnswerBox
                  label='CORRECT ANSWER'
                  text={expectedAns}
                  tone='expected'
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TextEntryCompare({ question, userResponse, correctResponse }) {
  const parts = question.incompleteStatement.split('<input>');
  const typed = userResponse[0] || '';
  const expected = correctResponse[0] || '';
  const isMatch = typed === expected;

  return (
    <div className='AttemptReview-textentry'>
      <p className='AttemptReview-textentry-sentence'>
        {parts[0]}
        <span
          className={`AttemptReview-inline-chip instrument-badge ${
            isMatch ? 'is-correct' : 'is-wrong'
          }`}
        >
          {typed || 'blank'}
        </span>
        {!isMatch && (
          <>
            <span className='AttemptReview-inline-arrow' aria-hidden='true'>
              →
            </span>
            <span className='AttemptReview-inline-chip is-expected instrument-badge'>
              {expected}
            </span>
          </>
        )}
        {parts[1]}
      </p>
    </div>
  );
}

function TableStyleCompare({ question, userResponse, correctResponse }) {
  const userTrueSet = new Set(userResponse);
  const correctTrueSet = new Set(correctResponse);

  return (
    <div className='AttemptReview-table'>
      {question.answerChoices.map((statement) => {
        const userTrue = userTrueSet.has(statement);
        const expectedTrue = correctTrueSet.has(statement);
        const isMatch = userTrue === expectedTrue;
        const userLabel = question.conditions[userTrue ? 0 : 1];
        const expectedLabel = question.conditions[expectedTrue ? 0 : 1];

        return (
          <div
            key={statement}
            className={`AttemptReview-table-row ${
              isMatch ? 'is-correct' : 'is-wrong'
            }`}
          >
            <p className='AttemptReview-table-statement'>{statement}</p>
            <div className='AttemptReview-table-picks'>
              <span
                className={`AttemptReview-table-badge instrument-badge ${
                  isMatch ? 'is-correct' : 'is-wrong'
                }`}
              >
                {isMatch ? 'CORRECT' : 'YOUR PICK'}: {userLabel}
              </span>
              {!isMatch && (
                <span className='AttemptReview-table-badge is-expected instrument-badge'>
                  EXPECTED: {expectedLabel}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderQuestionComparison(question, entry) {
  const userResponse = entry?.userResponse || [];
  const correctResponse =
    entry?.correctResponse || question.correctAnswer || [];

  switch (question.questionType) {
    case 'multi-select':
      return (
        <MultiSelectCompare
          question={question}
          userResponse={userResponse}
          correctResponse={correctResponse}
        />
      );
    case 'two-part':
      return (
        <TwoPartCompare
          question={question}
          userResponse={userResponse}
          correctResponse={correctResponse}
        />
      );
    case 'text-entry':
      return (
        <TextEntryCompare
          question={question}
          userResponse={userResponse}
          correctResponse={correctResponse}
        />
      );
    case 'table-style':
      return (
        <TableStyleCompare
          question={question}
          userResponse={userResponse}
          correctResponse={correctResponse}
        />
      );
    case 'multiple-choice':
    default: {
      const userAns = userResponse[0] || '(No response)';
      const expectedAns = correctResponse[0] || '';
      const isMatch = userAns === expectedAns;
      return (
        <div className='AttemptReview-answer-stack'>
          <AnswerBox
            label={isMatch ? 'YOUR ANSWER · CORRECT' : 'YOUR ANSWER'}
            text={userAns}
            tone={isMatch ? 'correct' : 'wrong'}
          />
          {!isMatch && (
            <AnswerBox
              label='CORRECT ANSWER'
              text={expectedAns}
              tone='expected'
            />
          )}
        </div>
      );
    }
  }
}

const AttemptReview = () => {
  const { id, attemptId } = useParams();
  const activeModuleId = Number(id);
  const userId = Number(
    sessionStorage.getItem('staar-training-platform-user-id')
  );
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState('all');
  const [mobilePane, setMobilePane] = useState('both');
  const reviewScrollRef = useRef(null);

  const questions = useQuestionsByModuleId(activeModuleId);
  const module = useModuleBySubjectAndId('english_two', activeModuleId);
  const attemptResult = useModuleAttempt(
    'english_two',
    activeModuleId,
    attemptId,
    userId
  );
  const { attemptState } = useModuleAttemptState(
    'english_two',
    activeModuleId,
    userId
  );

  useEffect(() => {
    if (reviewScrollRef.current) {
      reviewScrollRef.current.scrollTop = 0;
    }
  }, [filterMode, attemptId]);

  if (!questions || !module || attemptResult === undefined) {
    return (
      <div className='AttemptReview-shell'>
        <NavBar />
        <main className='AttemptReview'>
          <p className='AttemptReview-loading instrument-badge'>
            LOADING ATTEMPT REVIEW…
          </p>
        </main>
      </div>
    );
  }

  const attempt = attemptResult.attempt;
  const moduleInfo = module.targetModule?.[0];

  if (!attempt || !moduleInfo) {
    return (
      <div className='AttemptReview-shell'>
        <NavBar />
        <main className='AttemptReview AttemptReview--empty'>
          <div className='AttemptReview-missing-card'>
            <span className='AttemptReview-eyebrow instrument-badge'>
              ATTEMPT UNAVAILABLE
            </span>
            <h1 className='AttemptReview-missing-title'>
              Completed attempt record not found.
            </h1>
            <p className='AttemptReview-missing-copy'>
              Only submitted module attempts can be reviewed item-by-item. Check
              your student ledger or resume any active draft from the catalog.
            </p>
            <div className='AttemptReview-missing-actions'>
              <button
                type='button'
                className='AttemptReview-primary-btn instrument-badge'
                onClick={() => navigate('/profile')}
              >
                ← BACK TO PROFILE
              </button>
              <button
                type='button'
                className='AttemptReview-secondary-btn instrument-badge'
                onClick={() => navigate(`/english_two/modules/${activeModuleId}`)}
              >
                OPEN MODULE {activeModuleId} →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const responseEntries = attempt.responses || {};
  const hasItemResponses = Object.keys(responseEntries).length > 0;
  const questionItems = questions.questions.map((question, idx) => {
    const entry = responseEntries[String(question.id)] || null;
    const possible =
      entry?.totalPoints ?? (Number(question.totalPossiblePoints) || 1);
    const earned = entry?.pointsEarned ?? 0;
    return {
      question,
      questionNumber: idx + 1,
      entry,
      earned,
      possible,
      isFullCredit: earned === possible
    };
  });

  const missedItems = questionItems.filter((item) => !item.isFullCredit);
  const displayedItems = filterMode === 'missed' ? missedItems : questionItems;
  const completedCount = attemptState?.completedAttempts?.length || 0;
  const hasDraft = Boolean(attemptState?.activeDraft);
  const retakeLabel = hasDraft
    ? `RESUME ATTEMPT #${attemptState.activeDraft.attemptNumber} →`
    : `START ATTEMPT #${completedCount + 1} →`;

  return (
    <div className='AttemptReview-shell' data-mobile-pane={mobilePane}>
      <NavBar />
      <main className='AttemptReview'>
        <header className='AttemptReview-banner'>
          <div className='AttemptReview-banner-meta'>
            <button
              type='button'
              className='AttemptReview-back instrument-badge'
              onClick={() => navigate('/profile')}
            >
              ← PROFILE LEDGER
            </button>
            <span className='AttemptReview-eyebrow instrument-badge'>
              MODULE {String(moduleInfo.id).padStart(2, '0')} // ATTEMPT #
              {attempt.attemptNumber} REVIEW
            </span>
          </div>

          <div className='AttemptReview-banner-controls'>
            <div
              className='AttemptReview-mode-switch'
              role='group'
              aria-label='Narrow viewport pane focus'
            >
              <button
                type='button'
                className={`AttemptReview-mode-btn instrument-badge ${
                  mobilePane === 'passage' ? 'is-active' : ''
                }`}
                onClick={() => setMobilePane('passage')}
              >
                PASSAGE
              </button>
              <button
                type='button'
                className={`AttemptReview-mode-btn instrument-badge ${
                  mobilePane === 'review' ? 'is-active' : ''
                }`}
                onClick={() => setMobilePane('review')}
              >
                REVIEW
              </button>
              <button
                type='button'
                className={`AttemptReview-mode-btn instrument-badge ${
                  mobilePane === 'both' ? 'is-active' : ''
                }`}
                onClick={() => setMobilePane('both')}
              >
                STACKED
              </button>
            </div>

            <span className='AttemptReview-score-pill numeric-readout'>
              {(Number(attempt.scoreRatio) * 100).toFixed(1)}%
              {attempt.totalPossiblePoints > 0
                ? ` · ${attempt.totalPointsEarned}/${attempt.totalPossiblePoints} PTS`
                : ''}
            </span>
          </div>
        </header>

        <div className='AttemptReview-workspace'>
          <section
            className='AttemptReview-text-pane'
            aria-label='Reading Passage'
          >
            <Text module={activeModuleId} />
          </section>

          <section
            className='AttemptReview-panel-pane'
            aria-label='Attempt Question Breakdown'
          >
            <div className='AttemptReview-panel'>
              <div className='AttemptReview-toolbar'>
                <div className='AttemptReview-toolbar-meta'>
                  <span className='AttemptReview-toolbar-date'>
                    Submitted{' '}
                    {formatTimestampMs(attempt.submittedAtMs, {
                      fallback: 'Recorded'
                    })}
                  </span>
                </div>

                {hasItemResponses && (
                  <div
                    className='AttemptReview-filter'
                    role='group'
                    aria-label='Filter reviewed questions'
                  >
                    <button
                      type='button'
                      className={`AttemptReview-filter-btn instrument-badge ${
                        filterMode === 'all' ? 'is-active' : ''
                      }`}
                      onClick={() => setFilterMode('all')}
                    >
                      ALL ({questionItems.length})
                    </button>
                    <button
                      type='button'
                      className={`AttemptReview-filter-btn instrument-badge ${
                        filterMode === 'missed' ? 'is-active' : ''
                      }`}
                      disabled={missedItems.length === 0}
                      onClick={() => setFilterMode('missed')}
                    >
                      MISSED ({missedItems.length})
                    </button>
                  </div>
                )}
              </div>

              <div ref={reviewScrollRef} className='AttemptReview-list'>
                {!hasItemResponses ? (
                  <div className='AttemptReview-legacy-note'>
                    <p>
                      Question-level responses were not recorded for this legacy
                      score import ({(Number(attempt.scoreRatio) * 100).toFixed(1)}
                      %). Complete a fresh attempt to unlock full item-by-item
                      review and TEKS diagnostics.
                    </p>
                  </div>
                ) : displayedItems.length === 0 ? (
                  <div className='AttemptReview-perfect-note'>
                    <span className='AttemptReview-perfect-badge instrument-badge'>
                      PERFECT SCORE
                    </span>
                    <p>
                      Zero missed questions on Attempt #{attempt.attemptNumber}.
                      Switch back to ALL to inspect every question.
                    </p>
                  </div>
                ) : (
                  displayedItems.map(
                    ({
                      question,
                      questionNumber,
                      entry,
                      earned,
                      possible,
                      isFullCredit
                    }) => {
                      const tone = isFullCredit
                        ? 'correct'
                        : earned > 0
                          ? 'partial'
                          : 'missed';
                      const promptText =
                        question.questionType === 'two-part'
                          ? ''
                          : question.questionType === 'table-style'
                            ? question.directions
                            : question.question?.[0] ||
                              question.directions ||
                              '';

                      return (
                        <article
                          key={question.id}
                          className={`AttemptReview-card is-${tone}`}
                        >
                          <div className='AttemptReview-card-head'>
                            <div className='AttemptReview-card-badges'>
                              <span className='AttemptReview-q-badge instrument-badge'>
                                Q{questionNumber}
                              </span>
                              <span className='AttemptReview-type-badge instrument-badge'>
                                {question.questionType.replace('-', ' ')}
                              </span>
                              {(question.alignedStandards || []).map((std) => (
                                <span
                                  key={std}
                                  className='AttemptReview-teks-badge instrument-badge'
                                >
                                  {std}
                                </span>
                              ))}
                            </div>
                            <span
                              className={`AttemptReview-pts-pill is-${tone} numeric-readout`}
                            >
                              {earned} / {possible} PT{possible === 1 ? '' : 'S'}
                            </span>
                          </div>

                          {promptText && (
                            <h2 className='AttemptReview-prompt'>
                              {promptText}
                            </h2>
                          )}

                          {question.questionType === 'table-style' &&
                            question.question && (
                              <p className='AttemptReview-subprompt'>
                                {question.question}
                              </p>
                            )}

                          {question.selectedText && (
                            <blockquote className='AttemptReview-excerpt'>
                              “{question.selectedText}”
                            </blockquote>
                          )}

                          {renderQuestionComparison(question, entry)}
                        </article>
                      );
                    }
                  )
                )}
              </div>

              <div className='AttemptReview-footer'>
                <button
                  type='button'
                  className='AttemptReview-secondary-btn instrument-badge'
                  onClick={() => navigate('/english_two/modules')}
                >
                  MODULE CATALOG
                </button>
                <button
                  type='button'
                  className='AttemptReview-primary-btn instrument-badge'
                  onClick={() =>
                    navigate(`/english_two/modules/${activeModuleId}`)
                  }
                >
                  {retakeLabel}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AttemptReview;
