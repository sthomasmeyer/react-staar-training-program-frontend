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
    const { name } = evt.target;

    if (isChecked.includes(name)) {
      setIsChecked(isChecked.filter((elements) => elements !== name));
    } else {
      setIsChecked((elements) => [...elements, name]);
    }
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    let sortedCorrectAnswer = questionData.correctAnswer.sort();

    if (
      isChecked.length === questionData.correctAnswer.length &&
      isChecked
        .sort()
        .every((element, index) => element === sortedCorrectAnswer[index])
    ) {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: isChecked.sort(),
        totalPoints: 1,
        pointsEarned: 1,
        questionId: questionData.id,
        moduleId: questionData.moduleId,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
      recordResponse({
        questionId: questionData.id,
        totalPoints: 1,
        pointsEarned: 1
      });
    } else {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: isChecked.sort(),
        totalPoints: 1,
        pointsEarned: 0,
        questionId: questionData.id,
        moduleId: questionData.moduleId,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
      recordResponse({
        questionId: questionData.id,
        totalPoints: 1,
        pointsEarned: 0
      });
    }
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
        {questionData.answerChoices.map((option) => (
          <div key={option} className='MultiSelect-option'>
            <input
              type='checkbox'
              id={option}
              name={option}
              onChange={handleChange}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default MultiSelect;
