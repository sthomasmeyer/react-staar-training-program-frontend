import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TableStyle.css';

const TableStyle = ({
  questionData,
  recordResponse,
  questionNumForDisplay
}) => {
  const [selectedByRow, setSelectedByRow] = useState({});

  const handleChange = (quote, value) => {
    setSelectedByRow((prev) => ({
      ...prev,
      [quote]: value
    }));
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    const isSelected = Object.entries(selectedByRow)
      .filter(([, value]) => value === 'true')
      .map(([quote]) => quote);

    const sortedCorrectAnswer = [...questionData.correctAnswer].sort();
    const sortedUserResponse = [...isSelected].sort();

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
    <div className='TableStyle'>
      <h3>
        Q{questionNumForDisplay}: {questionData.directions}
      </h3>
      {questionData.selectedText ? (
        <div className='TableStyle-selected-text'>
          <p>"{questionData.selectedText}"</p>
        </div>
      ) : null}
      <div className='TableStyle-question'>
        <p>{questionData.question}</p>
      </div>
      <div className='TableStyle-table'>
        <div className='TableStyle-conditions'>
          <p id='TableStyle-statement'>Statement</p>{' '}
          <p>{questionData.conditions[0]}</p>{' '}
          <p>{questionData.conditions[1]}</p>
        </div>
        <form onSubmit={captureInput}>
          {questionData.answerChoices.map((quote, idx) => {
            const radioGroupName = `q-${questionData.id}-row-${idx}`;
            const trueInputId = `${radioGroupName}-true`;
            return (
              <div key={quote} className='TableStyle-option'>
                <div className='TableStyle-option-label'>
                  <label htmlFor={trueInputId}>{quote}</label>
                </div>
                <div className='TableStyle-option-checkbox'>
                  <input
                    type='radio'
                    id={trueInputId}
                    name={radioGroupName}
                    value='true'
                    checked={selectedByRow[quote] === 'true'}
                    onChange={() => handleChange(quote, 'true')}
                  />
                </div>
                <div className='TableStyle-option-checkbox'>
                  <input
                    type='radio'
                    name={radioGroupName}
                    value='false'
                    checked={selectedByRow[quote] === 'false'}
                    onChange={() => handleChange(quote, 'false')}
                  />
                </div>
              </div>
            );
          })}
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TableStyle;
