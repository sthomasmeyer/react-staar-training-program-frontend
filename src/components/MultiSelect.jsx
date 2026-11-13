import { useState } from 'react';
import QuestionCardHeader from './QuestionCardHeader';

const MultiSelect = ({
  questionData,
  savedUserResponse,
  onSaveAnswer,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [isChecked, setIsChecked] = useState(() =>
    Array.isArray(savedUserResponse) ? savedUserResponse : []
  );

  const handleChange = (value) => {
    setIsChecked((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const captureInput = (evt) => {
    evt.preventDefault();
    onSaveAnswer(questionData, [...isChecked].sort());
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
            const inputId = `q-${questionData.id}-ms-${idx}`;
            const checked = isChecked.includes(option);
            return (
              <label
                key={option}
                htmlFor={inputId}
                className={`QuestionCard-option ${checked ? 'is-selected' : ''}`}
              >
                <input
                  type='checkbox'
                  id={inputId}
                  name={option}
                  value={option}
                  checked={checked}
                  onChange={() => handleChange(option)}
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
            disabled={isChecked.length === 0}
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

export default MultiSelect;
