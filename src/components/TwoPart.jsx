import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TwoPart.css';

const TwoPart = ({ questionData, recordResponse, questionNumForDisplay }) => {
  const [selectedAnswerOne, setSelectedAnswerOne] = useState('');
  const [selectedAnswerTwo, setSelectedAnswerTwo] = useState('');

  const handleQuestionOne = (evt) => {
    setSelectedAnswerOne(evt.target.value);
  };

  const handleQuestionTwo = (evt) => {
    setSelectedAnswerTwo(evt.target.value);
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    const partOneCorrect = selectedAnswerOne === questionData.correctAnswer[0];
    const partTwoCorrect = selectedAnswerTwo === questionData.correctAnswer[1];
    const pointsEarned = (partOneCorrect ? 1 : 0) + (partTwoCorrect ? 1 : 0);

    submitResponse('english_two', {
      correctResponse: questionData.correctAnswer,
      userResponse: [selectedAnswerOne, selectedAnswerTwo],
      totalPoints: 2,
      pointsEarned,
      questionId: questionData.id,
      moduleId: questionData.moduleId,
      userId: Number(sessionStorage.getItem('staar-training-platform-user-id'))
    });

    recordResponse({
      questionId: questionData.id,
      totalPoints: 2,
      pointsEarned
    });
  };

  return (
    <div className='TwoPart'>
      <form onSubmit={captureInput}>
        <h3>
          Q{questionNumForDisplay}, Part A: {questionData.question[0]}
        </h3>
        {questionData.answerChoices[0].map((option, idx) => {
          const inputId = `q-${questionData.id}-part-a-${idx}`;
          return (
            <div key={option} className='TwoPart-option'>
              <input
                type='radio'
                id={inputId}
                name={`TwoPartQ1-${questionData.id}`}
                value={option}
                checked={selectedAnswerOne === option}
                onChange={handleQuestionOne}
              />
              <label htmlFor={inputId}>{option}</label>
            </div>
          );
        })}
        <h3>
          Q{questionNumForDisplay}, Part B: {questionData.question[1]}
        </h3>
        {questionData.answerChoices[1].map((option, idx) => {
          const inputId = `q-${questionData.id}-part-b-${idx}`;
          return (
            <div key={option} className='TwoPart-option'>
              <input
                type='radio'
                id={inputId}
                name={`TwoPartQ2-${questionData.id}`}
                value={option}
                checked={selectedAnswerTwo === option}
                onChange={handleQuestionTwo}
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

export default TwoPart;
