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
import useModulePerformanceByUser from '../hooks/useModulePerformanceByUser';
import firstAttemptSubmission from '../helpers/firstAttemptSubmission';
import modulePerformanceUpdate from '../helpers/modulePerformanceUpdate';
import '../styles/EngTwoModule.css';

const EngTwoModule = ({ moduleId }) => {
  const [responses, setResponses] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobilePane, setMobilePane] = useState('both');
  const questionsScrollRef = useRef(null);

  const navigate = useNavigate();
  const params = useParams();
  const activeModuleId = Number(moduleId ?? params.id);
  const userId = Number(
    sessionStorage.getItem('staar-training-platform-user-id')
  );

  const questions = useQuestionsByModuleId(activeModuleId);
  const module = useModuleBySubjectAndId('english_two', activeModuleId);
  const userPerformanceData = useModulePerformanceByUser(
    'english_two',
    activeModuleId,
    userId
  );

  const totalQuestions = questions?.questions?.length ?? 0;

  useEffect(() => {
    if (questionsScrollRef.current) {
      questionsScrollRef.current.scrollTop = 0;
    }
  }, [selectedQuestionId, activeModuleId]);

  useEffect(() => {
    if (totalQuestions === 0) return undefined;

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
  }, [totalQuestions]);

  if (!questions || !module) {
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

  const answeredQuestionIds = new Set(responses.map((r) => r.questionId));
  const hasAnsweredAllQuestions =
    totalQuestions > 0 && responses.length === totalQuestions;

  const trackResponse = (response) => {
    setResponses((prev) => [
      ...prev.filter((item) => item.questionId !== response.questionId),
      response
    ]);

    if (selectedQuestionId < totalQuestions) {
      setSelectedQuestionId((prev) => Math.min(prev + 1, totalQuestions));
    }
  };

  const updateModulePerformance = async (evt) => {
    evt.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const totalPossiblePoints = questions.questions.reduce(
      (sum, q) => sum + q.totalPossiblePoints,
      0
    );
    const totalPointsEarned = responses.reduce(
      (sum, r) => sum + r.pointsEarned,
      0
    );
    const scoreRatio =
      totalPossiblePoints > 0 ? totalPointsEarned / totalPossiblePoints : 0;

    const existingPerf = userPerformanceData?.userPerformanceData;

    if (!existingPerf) {
      await firstAttemptSubmission('english_two', {
        firstAttempt: scoreRatio,
        bestOverall: scoreRatio,
        moduleId: activeModuleId,
        userId
      });
    } else if (scoreRatio > Number(existingPerf.bestOverall)) {
      await modulePerformanceUpdate('english_two', {
        bestOverall: scoreRatio,
        moduleId: activeModuleId,
        userId
      });
    }

    navigate('/english_two/modules');
  };

  const renderQuestionComponent = (question, questionNumber) => {
    const commonProps = {
      questionData: question,
      recordResponse: trackResponse,
      questionNumForDisplay: questionNumber,
      hasSavedResponse: answeredQuestionIds.has(question.id),
      isLastQuestion: questionNumber === totalQuestions
    };

    switch (question.questionType) {
      case 'multi-select':
        return <MultiSelect {...commonProps} />;
      case 'multiple-choice':
        return <TraditionalMultipleChoice {...commonProps} />;
      case 'two-part':
        return <TwoPart {...commonProps} />;
      case 'text-entry':
        return <TextEntry {...commonProps} />;
      case 'table-style':
        return <TableStyle {...commonProps} />;
      default:
        return null;
    }
  };

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
                <span>Q{selectedQuestionId}</span>
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

            <div className='EngTwoModule-progress instrument-badge'>
              <span>
                ANSWERED {responses.length} / {totalQuestions}
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
            <div className='EngTwoModule-questions-panel'>
              <div className='EngTwoModule-nav-row'>
                <div
                  className='EngTwoModule-questions-navigation'
                  role='tablist'
                  aria-label='Question Selector'
                >
                  {questions.questions.map((question, index) => {
                    const questionNumber = index + 1;
                    const isSelected = questionNumber === selectedQuestionId;
                    const isAnswered = answeredQuestionIds.has(question.id);
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
                    Review any question above or submit your final score for
                    Module {activeModuleId}.
                  </p>
                </div>
                <button
                  type='button'
                  id='EngTwoModule-questions-final-submit-btn'
                  className='instrument-badge'
                  disabled={isSubmitting}
                  onClick={updateModulePerformance}
                >
                  {isSubmitting
                    ? 'RECORDING SCORE...'
                    : `SUBMIT MODULE ${activeModuleId}`}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default EngTwoModule;
