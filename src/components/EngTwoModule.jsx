import { useState } from 'react';
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

  if (!questions || !module) {
    return <p>Loading...</p>;
  }

  const totalQuestions = questions.questions.length;
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

  const selectQuestion = (questionNumber) => {
    setSelectedQuestionId(questionNumber);
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
      questionNumForDisplay: questionNumber
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
    <div className='EngTwoModule'>
      <NavBar />
      <div className='EngTwoModule-banner'>
        <h1>
          Module {module.targetModule[0].id}:{' '}
          {module.targetModule[0].moduleName}
        </h1>
      </div>
      <div className='EngTwoModule-text'>
        <Text module={activeModuleId} />
      </div>
      <div className='EngTwoModule-questions'>
        <div className='EngTwoModule-questions-navigation'>
          {questions.questions.map((question, index) => {
            const questionNumber = index + 1;
            return (
              <button
                key={question.id}
                type='button'
                className='EngTwoModule-questions-navigation-btn'
                onClick={() => selectQuestion(questionNumber)}
              >
                Q{questionNumber}
              </button>
            );
          })}
        </div>
        <div className='EngTwoModule-questions-main'>
          {questions.questions.map((question, index) => {
            const questionNumber = index + 1;
            const isSelected = questionNumber === selectedQuestionId;

            return (
              <div
                id={String(questionNumber)}
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
        {hasAnsweredAllQuestions ? (
          <div className='EngTwoModule-final-submission'>
            <p className='EngTwoModule-final-submission-warning'>
              <strong>Warning:</strong> DO NOT press this final submission
              button,{' '}
              <em>
                until you have submitted a response for every question in the
                module.
              </em>
            </p>
            <button
              type='button'
              id='EngTwoModule-questions-final-submit-btn'
              disabled={isSubmitting}
              onClick={updateModulePerformance}
            >
              Final Module {activeModuleId} Submission
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EngTwoModule;
