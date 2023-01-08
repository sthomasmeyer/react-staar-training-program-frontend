import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import '../styles/TableStyle.css';

const TableStyle = ({
  questionData,
  recordResponse,
  questionNumForDisplay
}) => {
  const [isSelected, setIsSelected] = useState([]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    if (value === 'true') {
      if (isSelected.includes(name)) {
        setIsSelected(isSelected.filter((elements) => elements !== name));
      } else {
        setIsSelected((elements) => [...elements, name]);
      }
    } else if (value === 'false') {
      if (isSelected.includes(name)) {
        setIsSelected(isSelected.filter((elements) => elements !== name));
      }
    }
  };

  const captureInput = (evt) => {
    evt.preventDefault();

    let sortedCorrectAnswer = questionData.correctAnswer.sort();

    if (
      isSelected.length === questionData.correctAnswer.length &&
      isSelected
        .sort()
        .every((element, index) => element === sortedCorrectAnswer[index])
    ) {
      submitResponse('english_two', {
        correctResponse: questionData.correctAnswer,
        userResponse: isSelected.sort(),
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
        userResponse: isSelected.sort(),
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
          {questionData.answerChoices.map((quote) => (
            <div key={quote} className='TableStyle-option'>
              <div className='TableStyle-option-label'>
                <label htmlFor={quote}>{quote}</label>
              </div>
              <div className='TableStyle-option-checkbox'>
                <input
                  type='radio'
                  name={quote}
                  value='true'
                  onChange={handleChange}
                />
              </div>
              <div className='TableStyle-option-checkbox'>
                <input
                  type='radio'
                  name={quote}
                  value='false'
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TableStyle;
