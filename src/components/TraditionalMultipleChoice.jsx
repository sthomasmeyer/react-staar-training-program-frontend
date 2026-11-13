import { useState } from 'react';
import QuestionCardHeader from './QuestionCardHeader';

const TraditionalMultipleChoice = ({
  questionData,
  savedUserResponse,
  onSaveAnswer,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(
    () => savedUserResponse?.[0] || ''
  );

  const captureInput = (evt) => {
    evt.preventDefault();
    onSaveAnswer(questionData, [selectedAnswer]);
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
