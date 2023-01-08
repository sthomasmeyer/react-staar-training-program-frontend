import React, { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TraditionalMultipleChoice.css';

const TraditionalMultipleChoice = ({
  questionData,
  recordResponse,
  questionNumForDisplay
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState([]);

  const handleChange = (evt) => {
    const { id } = evt.target;
    setSelectedAnswer(id);
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    if (
      selectedAnswer
        .split()
        .sort()
        .every(
          (element, index) => element === questionData.correctAnswer[index]
        )
    ) {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        // Note, the [split()] method converts a string into an array.
        userResponse: selectedAnswer.split(),
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
        // Note, the [split()] method converts a string into an array.
        userResponse: selectedAnswer.split(),
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
    <div className='TraditionalMultipleChoice'>
      <h3>
        Q{questionNumForDisplay}: {questionData.question}
      </h3>
      <form onSubmit={captureInput}>
        {questionData.answerChoices.map((option) => (
          <div key={option} className='TraditionalMultipleChoice-option'>
            <input
              type='radio'
              id={option}
              name='TraditionalMultipleChoice'
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

export default TraditionalMultipleChoice;
