import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/MultiSelect.css';

const MultiSelect = ({
  questionData,
  recordResponse,
  questionNumForDisplay
}) => {
  const [isChecked, setIsChecked] = useState([]);

  const handleChange = (evt) => {
    const { value } = evt.target;

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
    <div className='MultiSelect'>
      <h3>
        Q{questionNumForDisplay}: {questionData.question}
      </h3>
      {questionData.selectedText ? (
        <div className='MultiSelect-selected-text'>
          <p>"{questionData.selectedText}"</p>
        </div>
      ) : null}
      <form onSubmit={captureInput}>
        {questionData.answerChoices.map((option, idx) => {
          const inputId = `q-${questionData.id}-ms-${idx}`;
          return (
            <div key={option} className='MultiSelect-option'>
              <input
                type='checkbox'
                id={inputId}
                name={option}
                value={option}
                checked={isChecked.includes(option)}
                onChange={handleChange}
              />
              <label htmlFor={inputId}>{option}</label>
            </div>
          );
        })}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default MultiSelect;
