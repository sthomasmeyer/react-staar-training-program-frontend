import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TwoPart.css';

const TwoPart = ({ questionData, recordResponse, questionNumForDisplay }) => {
  const [selectedAnswerOne, setSelectedAnswerOne] = useState([]);
  const [selectedAnswerTwo, setSelectedAnswerTwo] = useState([]);

  const handleQuestionOne = (evt) => {
    const { id } = evt.target;
    setSelectedAnswerOne(id);
  };

  const handleQuestionTwo = (evt) => {
    const { id } = evt.target;
    setSelectedAnswerTwo(id);
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    if (
      selectedAnswerOne !== questionData.correctAnswer[0] &&
      selectedAnswerTwo !== questionData.correctAnswer[1]
    ) {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: [selectedAnswerOne, selectedAnswerTwo],
        totalPoints: 2,
        pointsEarned: 0,
        questionId: questionData.id,
        moduleId: questionData.moduleId,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
      recordResponse({
        questionId: questionData.id,
        totalPoints: 2,
        pointsEarned: 0
      });
    } else if (
      selectedAnswerOne === questionData.correctAnswer[0] &&
      selectedAnswerTwo === questionData.correctAnswer[1]
    ) {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: [selectedAnswerOne, selectedAnswerTwo],
        totalPoints: 2,
        pointsEarned: 2,
        questionId: questionData.id,
        moduleId: questionData.moduleId,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
      recordResponse({
        questionId: questionData.id,
        totalPoints: 2,
        pointsEarned: 2
      });
    } else {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: [selectedAnswerOne, selectedAnswerTwo],
        totalPoints: 2,
        pointsEarned: 1,
        questionId: questionData.id,
        moduleId: questionData.moduleId,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
      recordResponse({
        questionId: questionData.id,
        totalPoints: 2,
        pointsEarned: 1
      });
    }
  };

  return (
    <div className='TwoPart'>
      <form onSubmit={captureInput}>
        <h3>
          Q{questionNumForDisplay}, Part A: {questionData.question[0]}
        </h3>
        {questionData.answerChoices[0].map((option) => (
          <div key={option} className='TwoPart-option'>
            <input
              type='radio'
              id={option}
              name='TwoPartQ1'
              onChange={handleQuestionOne}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
        <h3>
          Q{questionNumForDisplay}, Part B: {questionData.question[1]}
        </h3>
        {questionData.answerChoices[1].map((option) => (
          <div key={option} className='TwoPart-option'>
            <input
              type='radio'
              id={option}
              name='TwoPartQ2'
              onChange={handleQuestionTwo}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default TwoPart;
