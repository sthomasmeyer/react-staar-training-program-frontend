import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import QuestionCardHeader from './QuestionCardHeader';

const MultiSelect = ({
  questionData,
  recordResponse,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [isChecked, setIsChecked] = useState([]);

  const handleChange = (value) => {
    setIsChecked((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    const sortedCorrectAnswer = [...questionData.correctAnswer].sort();
    const sortedUserResponse = [...isChecked].sort();

    const isCorrect =
      sortedUserResponse.length === sortedCorrectAnswer.length &&
      sortedUserResponse.every(
        (element, index) => element === sortedCorrectAnswer[index]
      );

    const pointsEarned = isCorrect ? 1 : 0;

    submitResponse('english_two', {
      correctResponse: questionData.correctAnswer,
      userResponse: sortedUserResponse,
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
