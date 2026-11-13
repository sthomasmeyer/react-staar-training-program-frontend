import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Text from './Text';
import TraditionalMultipleChoice from './TraditionalMultipleChoice';
import MultiSelect from './MultiSelect';
import TwoPart from './TwoPart';
import TextEntry from './TextEntry';
import TableStyle from './TableStyle';
import NavBar from './NavBar';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import useModuleBySubjectAndId from '../hooks/useModuleBySubjectAndId';
import useModuleAttemptState from '../hooks/useModuleAttemptState';
import {
  completeModuleAttempt,
  discardActiveAttempt,
  saveAttemptAnswer
} from '../api/staarApi';
import '../styles/EngTwoModule.css';

const EngTwoModule = ({ moduleId }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [draftEpoch, setDraftEpoch] = useState(0);
  const [mobilePane, setMobilePane] = useState('both');

  const questionsScrollRef = useRef(null);
  const hydratedModuleRef = useRef(null);

  const navigate = useNavigate();
  const params = useParams();
  const activeModuleId = Number(moduleId ?? params.id);
  const userId = Number(
    sessionStorage.getItem('staar-training-platform-user-id')
  );

  const questions = useQuestionsByModuleId(activeModuleId);
  const module = useModuleBySubjectAndId('english_two', activeModuleId);
  const { attemptState, setAttemptState } = useModuleAttemptState(
    'english_two',
    activeModuleId,
    userId
  );

  const totalQuestions = questions?.questions?.length ?? 0;

  useEffect(() => {
    hydratedModuleRef.current = null;
    setSubmittedReceipt(null);
    setConfirmDiscard(false);
    setSelectedQuestionId(1);
  }, [activeModuleId]);

  useEffect(() => {
    if (!questions || !attemptState) return;
    if (hydratedModuleRef.current === activeModuleId) return;

    hydratedModuleRef.current = activeModuleId;
    const savedMap = attemptState.activeDraft?.responses || {};
    const firstUnansweredIndex = questions.questions.findIndex(
      (q) => !savedMap[String(q.id)]
    );

    if (firstUnansweredIndex !== -1) {
      setSelectedQuestionId(firstUnansweredIndex + 1);
    } else {
      setSelectedQuestionId(1);
    }
  }, [questions, attemptState, activeModuleId]);

  useEffect(() => {
    if (questionsScrollRef.current) {
      questionsScrollRef.current.scrollTop = 0;
    }
  }, [selectedQuestionId, activeModuleId, submittedReceipt]);

  useEffect(() => {
    if (totalQuestions === 0 || submittedReceipt) return undefined;

    const handleKeyDown = (evt) => {
      const tag = evt.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }
      if (evt.key === 'ArrowLeft') {
        setSelectedQuestionId((prev) => Math.max(1, prev - 1));
      } else if (evt.key === 'ArrowRight') {
        setSelectedQuestionId((prev) => Math.min(totalQuestions, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalQuestions, submittedReceipt]);

  if (!questions || !module || !attemptState) {
    return (
      <div className='EngTwoModule-shell'>
        <NavBar />
        <main className='EngTwoModule'>
          <p className='EngTwoModule-loading instrument-badge'>
            LOADING MODULE {activeModuleId}…
          </p>
        </main>
      </div>
    );
  }

  const activeDraft = attemptState.activeDraft;
  const savedMap = activeDraft?.responses || {};
  const answeredCount = questions.questions.filter(
    (q) => Boolean(savedMap[String(q.id)])
  ).length;
  const hasAnsweredAllQuestions =
    totalQuestions > 0 && answeredCount === totalQuestions;
  const displayAttemptNumber =
    activeDraft?.attemptNumber || attemptState.completedAttempts.length + 1;
  const draftInstanceKey = `${activeModuleId}-${activeDraft?.id || 'fresh'}-${draftEpoch}`;

  const handleSaveAnswer = async (questionData, userResponse) => {
    const { attempt } = await saveAttemptAnswer('english_two', {
      moduleId: activeModuleId,
      userId,
      questionData,
      userResponse,
      questionCount: totalQuestions
    });

    setAttemptState((prev) => ({
      ...prev,
      activeDraft: attempt
    }));
    setConfirmDiscard(false);

    if (selectedQuestionId < totalQuestions) {
      setSelectedQuestionId((prev) => Math.min(prev + 1, totalQuestions));
    }
  };

  const handleDiscardDraft = async () => {
    if (!confirmDiscard) {
      setConfirmDiscard(true);
      return;
    }

    const nextState = await discardActiveAttempt('english_two', {
      attemptId: activeDraft?.id,
      moduleId: activeModuleId,
      userId
    });

    setAttemptState(nextState);
    setDraftEpoch((prev) => prev + 1);
    setSelectedQuestionId(1);
    setConfirmDiscard(false);
  };

  const handleCompleteAttempt = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const previousBest = attemptState.summary?.bestOverall ?? null;
      const totalPossiblePoints = questions.questions.reduce(
        (sum, q) => sum + (Number(q.totalPossiblePoints) || 1),
        0
      );

      const { completedAttempt, summary } = await completeModuleAttempt(
        'english_two',
        {
          attemptId: activeDraft?.id,
          moduleId: activeModuleId,
          userId,
          totalPossiblePoints
        }
      );

      setSubmittedReceipt({
        attempt: completedAttempt,
        previousBest
      });
      setAttemptState({
        activeDraft: null,
        completedAttempts: summary.completedAttempts,
        summary
      });
      setDraftEpoch((prev) => prev + 1);
      setConfirmDiscard(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartRetake = () => {
    setSubmittedReceipt(null);
    setSelectedQuestionId(1);
    setConfirmDiscard(false);
    setDraftEpoch((prev) => prev + 1);
  };

  const renderQuestionComponent = (question, questionNumber) => {
    const savedEntry = savedMap[String(question.id)];
    const commonProps = {
      questionData: question,
      savedUserResponse: savedEntry?.userResponse ?? null,
      onSaveAnswer: handleSaveAnswer,
      questionNumForDisplay: questionNumber,
      hasSavedResponse: Boolean(savedEntry),
      isLastQuestion: questionNumber === totalQuestions
    };

    const componentKey = `${draftInstanceKey}-q-${question.id}`;

    switch (question.questionType) {
      case 'multi-select':
        return <MultiSelect key={componentKey} {...commonProps} />;
      case 'multiple-choice':
        return <TraditionalMultipleChoice key={componentKey} {...commonProps} />;
      case 'two-part':
        return <TwoPart key={componentKey} {...commonProps} />;
      case 'text-entry':
        return <TextEntry key={componentKey} {...commonProps} />;
      case 'table-style':
        return <TableStyle key={componentKey} {...commonProps} />;
      default:
        return null;
    }
  };

  const receipt = submittedReceipt?.attempt || null;
  const isNewBest =
    receipt &&
    submittedReceipt.previousBest !== null &&
    receipt.scoreRatio > submittedReceipt.previousBest;

  return (
    <div className='EngTwoModule-shell' data-mobile-pane={mobilePane}>
      <NavBar />
      <main className='EngTwoModule'>
        <header className='EngTwoModule-banner'>
          <div className='EngTwoModule-banner-meta'>
            <button
              type='button'
              className='EngTwoModule-back instrument-badge'
              onClick={() => navigate('/english_two/modules')}
            >
              ← ALL MODULES
            </button>
            <span className='EngTwoModule-eyebrow instrument-badge'>
              MODULE {String(module.targetModule[0].id).padStart(2, '0')} //{' '}
              {module.targetModule[0].moduleName.toUpperCase()}
            </span>
          </div>

          <div className='EngTwoModule-banner-controls'>
            <div
              className='EngTwoModule-mode-switch EngTwoModule-mode-switch--mobile'
              role='group'
              aria-label='Narrow viewport pane focus'
            >
              <button
                type='button'
                className={`EngTwoModule-mode-btn instrument-badge ${
                  mobilePane === 'passage' ? 'is-active' : ''
                }`}
                aria-pressed={mobilePane === 'passage'}
                onClick={() => setMobilePane('passage')}
              >
                <span>PASSAGE</span>
              </button>
              <button
                type='button'
                className={`EngTwoModule-mode-btn instrument-badge ${
                  mobilePane === 'question' ? 'is-active' : ''
                }`}
                aria-pressed={mobilePane === 'question'}
                onClick={() => setMobilePane('question')}
              >
                <span>{receipt ? 'SCORE' : `Q${selectedQuestionId}`}</span>
              </button>
              <button
                type='button'
                className={`EngTwoModule-mode-btn instrument-badge ${
                  mobilePane === 'both' ? 'is-active' : ''
                }`}
                aria-pressed={mobilePane === 'both'}
                onClick={() => setMobilePane('both')}
              >
                <span>STACKED</span>
              </button>
            </div>

            {!receipt && (
              <span className='EngTwoModule-attempt-pill instrument-badge'>
                ATTEMPT #{displayAttemptNumber}
              </span>
            )}

            <div className='EngTwoModule-progress instrument-badge'>
              <span>
                {receipt
                  ? `SCORE ${(receipt.scoreRatio * 100).toFixed(1)}%`
                  : `ANSWERED ${answeredCount} / ${totalQuestions}`}
              </span>
            </div>
          </div>
        </header>

        <div className='EngTwoModule-workspace'>
          <section
            className='EngTwoModule-text-pane'
            aria-label='Reading Passage'
          >
            <Text module={activeModuleId} />
          </section>

          <section
            className='EngTwoModule-questions-pane'
            aria-label='Assessment Questions'
          >
            {receipt ? (
              <div className='EngTwoModule-receipt'>
                <div className='EngTwoModule-receipt-head'>
                  <div className='EngTwoModule-receipt-badges'>
                    <span className='EngTwoModule-receipt-eyebrow instrument-badge'>
                      ATTEMPT #{receipt.attemptNumber} RECORDED
                    </span>
                    {isNewBest && (
                      <span className='EngTwoModule-receipt-best instrument-badge'>
                        NEW PERSONAL BEST
                      </span>
                    )}
                  </div>
                  <div className='EngTwoModule-receipt-score-row'>
                    <span className='EngTwoModule-receipt-pct numeric-readout'>
                      {(receipt.scoreRatio * 100).toFixed(1)}%
                    </span>
                    <span className='EngTwoModule-receipt-pts instrument-badge'>
                      {receipt.totalPointsEarned} /{' '}
                      {receipt.totalPossiblePoints} POINTS
                    </span>
                  </div>
                </div>

                <div
                  ref={questionsScrollRef}
                  className='EngTwoModule-receipt-body'
                >
                  <span className='EngTwoModule-receipt-subhead instrument-badge'>
                    QUESTION BREAKDOWN
                  </span>
                  <ul className='EngTwoModule-receipt-list'>
                    {questions.questions.map((question, idx) => {
                      const entry = receipt.responses[String(question.id)];
                      const earned = entry?.pointsEarned ?? 0;
                      const possible =
                        entry?.totalPoints ??
                        (Number(question.totalPossiblePoints) || 1);
                      const isFull = earned === possible;
                      const isPartial = earned > 0 && earned < possible;

                      return (
                        <li
                          key={question.id}
                          className={`EngTwoModule-receipt-item ${
                            isFull
                              ? 'is-correct'
                              : isPartial
                                ? 'is-partial'
                                : 'is-missed'
                          }`}
                        >
                          <div className='EngTwoModule-receipt-item-meta'>
                            <span className='EngTwoModule-receipt-q instrument-badge'>
                              Q{idx + 1}
                            </span>
                            {(question.alignedStandards || []).map((std) => (
                              <span
                                key={std}
                                className='EngTwoModule-receipt-teks instrument-badge'
                              >
                                {std}
                              </span>
                            ))}
                          </div>
                          <span className='EngTwoModule-receipt-item-pts numeric-readout'>
                            {earned} / {possible} PT{possible === 1 ? '' : 'S'}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='EngTwoModule-receipt-actions'>
                  <button
                    type='button'
                    className='EngTwoModule-receipt-primary instrument-badge'
                    onClick={() =>
                      navigate(
                        `/english_two/modules/${activeModuleId}/attempts/${receipt.id}`
                      )
                    }
                  >
                    REVIEW ANSWERS →
                  </button>
                  <button
                    type='button'
                    className='EngTwoModule-receipt-secondary instrument-badge'
                    onClick={() => navigate('/profile')}
                  >
                    PROFILE LEDGER
                  </button>
                  <button
                    type='button'
                    className='EngTwoModule-receipt-secondary instrument-badge'
                    onClick={handleStartRetake}
                  >
                    RETAKE #{receipt.attemptNumber + 1}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className='EngTwoModule-questions-panel'>
                  <div className='EngTwoModule-nav-row'>
                    <div
                      className='EngTwoModule-questions-navigation'
                      role='tablist'
                      aria-label='Question Selector'
                    >
                      {questions.questions.map((question, index) => {
                        const questionNumber = index + 1;
                        const isSelected =
                          questionNumber === selectedQuestionId;
                        const isAnswered = Boolean(
                          savedMap[String(question.id)]
                        );
                        return (
                          <button
                            key={question.id}
                            type='button'
                            role='tab'
                            aria-selected={isSelected}
                            className={`EngTwoModule-questions-navigation-btn instrument-badge ${
                              isSelected ? 'is-selected' : ''
                            } ${isAnswered ? 'is-answered' : ''}`}
                            onClick={() => setSelectedQuestionId(questionNumber)}
                          >
                            <span>Q{questionNumber}</span>
                            <span
                              className='EngTwoModule-q-dot'
                              aria-hidden='true'
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className='EngTwoModule-steppers'>
                      <button
                        type='button'
                        className='EngTwoModule-step-btn instrument-badge'
                        disabled={selectedQuestionId <= 1}
                        onClick={() =>
                          setSelectedQuestionId((prev) => Math.max(1, prev - 1))
                        }
                        aria-label='Previous question'
                      >
                        ←
                      </button>
                      <button
                        type='button'
                        className='EngTwoModule-step-btn instrument-badge'
                        disabled={selectedQuestionId >= totalQuestions}
                        onClick={() =>
                          setSelectedQuestionId((prev) =>
                            Math.min(totalQuestions, prev + 1)
                          )
                        }
                        aria-label='Next question'
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {answeredCount > 0 && activeDraft && (
                    <div className='EngTwoModule-draft-strip'>
                      <span className='EngTwoModule-draft-status instrument-badge'>
                        DRAFT SAVED · {answeredCount} / {totalQuestions} READY
                      </span>
                      <div className='EngTwoModule-draft-controls'>
                        {confirmDiscard ? (
                          <>
                            <button
                              type='button'
                              className='EngTwoModule-draft-btn EngTwoModule-draft-btn--danger instrument-badge'
                              onClick={handleDiscardDraft}
                            >
                              CONFIRM RESET
                            </button>
                            <button
                              type='button'
                              className='EngTwoModule-draft-btn instrument-badge'
                              onClick={() => setConfirmDiscard(false)}
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <button
                            type='button'
                            className='EngTwoModule-draft-btn instrument-badge'
                            onClick={handleDiscardDraft}
                          >
                            START OVER
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    ref={questionsScrollRef}
                    className='EngTwoModule-questions-main'
                  >
                    {questions.questions.map((question, index) => {
                      const questionNumber = index + 1;
                      const isSelected = questionNumber === selectedQuestionId;

                      return (
                        <div
                          id={`question-slot-${questionNumber}`}
                          key={question.id}
                          className={
                            isSelected
                              ? 'EngTwoModule-questions-main-question--selected'
                              : 'EngTwoModule-questions-main-question'
                          }
                        >
                          {renderQuestionComponent(question, questionNumber)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {hasAnsweredAllQuestions && (
                  <div className='EngTwoModule-final-submission'>
                    <div className='EngTwoModule-final-copy'>
                      <span className='EngTwoModule-final-badge instrument-badge'>
                        ALL {totalQuestions} QUESTIONS SAVED
                      </span>
                      <p className='EngTwoModule-final-warning'>
                        Review any question above or record Attempt #
                        {displayAttemptNumber} for Module {activeModuleId}.
                      </p>
                    </div>
                    <button
                      type='button'
                      id='EngTwoModule-questions-final-submit-btn'
                      className='instrument-badge'
                      disabled={isSubmitting}
                      onClick={handleCompleteAttempt}
                    >
                      {isSubmitting
                        ? 'RECORDING SCORE...'
                        : `SUBMIT ATTEMPT #${displayAttemptNumber}`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default EngTwoModule;
