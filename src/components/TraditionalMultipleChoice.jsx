import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import QuestionCardHeader from './QuestionCardHeader';

const TraditionalMultipleChoice = ({
  questionData,
  recordResponse,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const captureInput = (evt) => {
    evt.preventDefault();

    const isCorrect = selectedAnswer === questionData.correctAnswer[0];
    const pointsEarned = isCorrect ? 1 : 0;

    submitResponse('english_two', {
      correctResponse: questionData.correctAnswer,
      userResponse: [selectedAnswer],
      totalPoints: 1,
      pointsEarned,
      questionId: questionData.id,
      moduleId: questionData.moduleId,
      userId: Number(sessionStorage.getItem('staar-training-platform-user-id'))
    });

    recordResponse({
      questionId: questionData.id,
      totalPoints: 1,
      pointsEarned
    });
  };

  return (
    <div className='QuestionCard'>
      <QuestionCardHeader
        questionData={questionData}
        questionNumForDisplay={questionNumForDisplay}
        hasSavedResponse={hasSavedResponse}
      />

      <form className='QuestionCard-form' onSubmit={captureInput}>
        <div className='QuestionCard-options'>
          {questionData.answerChoices.map((option, idx) => {
            const inputId = `q-${questionData.id}-mc-${idx}`;
            const checked = selectedAnswer === option;
            return (
              <label
                key={option}
                htmlFor={inputId}
                className={`QuestionCard-option ${checked ? 'is-selected' : ''}`}
              >
                <input
                  type='radio'
                  id={inputId}
                  name={`TraditionalMultipleChoice-${questionData.id}`}
                  value={option}
                  checked={checked}
                  onChange={(evt) => setSelectedAnswer(evt.target.value)}
                />
                <span className='QuestionCard-option-text'>{option}</span>
              </label>
            );
          })}
        </div>

        <div className='QuestionCard-actions'>
          <button
            type='submit'
            className='QuestionCard-submit-btn instrument-badge'
            disabled={!selectedAnswer}
          >
            {isLastQuestion ? 'SAVE RESPONSE' : 'SAVE & NEXT →'}
          </button>
          {hasSavedResponse && (
            <span className='QuestionCard-saved-note instrument-badge'>
              EDIT & RESAVE ANYTIME
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default TraditionalMultipleChoice;
