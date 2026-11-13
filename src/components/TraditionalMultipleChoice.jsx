import React, { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TraditionalMultipleChoice.css';

const TraditionalMultipleChoice = ({
  questionData,
  recordResponse,
  questionNumForDisplay
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleChange = (evt) => {
    setSelectedAnswer(evt.target.value);
  };

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
    <div className='TraditionalMultipleChoice'>
      <h3>
        Q{questionNumForDisplay}: {questionData.question}
      </h3>
      <form onSubmit={captureInput}>
        {questionData.answerChoices.map((option, idx) => {
          const inputId = `q-${questionData.id}-mc-${idx}`;
          return (
            <div key={option} className='TraditionalMultipleChoice-option'>
              <input
                type='radio'
                id={inputId}
                name={`TraditionalMultipleChoice-${questionData.id}`}
                value={option}
                checked={selectedAnswer === option}
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

export default TraditionalMultipleChoice;
