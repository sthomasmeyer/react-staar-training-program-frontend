import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TextEntry.css';

const TextEntry = ({ questionData, recordResponse, questionNumForDisplay }) => {
  const [userGeneratedAnswer, setUserGeneratedAnswer] = useState('');

  const ncmpltStatement = questionData.incompleteStatement.split('<input>');

  const handleChange = (evt) => {
    const { value } = evt.target;
    const cleanVal = value.toLowerCase().replace(/\s+/g, '');
    setUserGeneratedAnswer(cleanVal);
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    const isCorrect = userGeneratedAnswer === questionData.correctAnswer[0];
    const pointsEarned = isCorrect ? 1 : 0;

    submitResponse('english_two', {
      correctResponse: questionData.correctAnswer,
      userResponse: [userGeneratedAnswer],
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
    <div className='TextEntry'>
      {questionData.question ? (
        <h3>
          Q{questionNumForDisplay}: {questionData.question}
        </h3>
      ) : (
        <h3>
          Q{questionNumForDisplay}: {questionData.directions}
        </h3>
      )}
      {questionData.selectedText ? (
        <div className='TextEntry-selected-text'>
          <p>"{questionData.selectedText}"</p>
        </div>
      ) : null}
      <div className='TextEntry-incomplete-statement'>
        <form onSubmit={captureInput}>
          <p>
            {ncmpltStatement[0]}
            <input
              type='text'
              id={`text-entry-${questionData.id}`}
              name='userGeneratedAnswer'
              value={userGeneratedAnswer}
              onChange={handleChange}
            />
            {ncmpltStatement[1]}
          </p>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TextEntry;
