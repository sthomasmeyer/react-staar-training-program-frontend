import { useState } from 'react';
import submitResponse from '../helpers/submitResponse';
import QuestionCardHeader from './QuestionCardHeader';
import '../styles/TableStyle.css';

const TableStyle = ({
  questionData,
  recordResponse,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
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

  const allRowsSelected =
    Object.keys(selectedByRow).length === questionData.answerChoices.length;

  return (
    <div className='QuestionCard TableStyle'>
      <QuestionCardHeader
        questionData={questionData}
        questionNumForDisplay={questionNumForDisplay}
        hasSavedResponse={hasSavedResponse}
        promptOverride={questionData.directions}
      />

      {questionData.question && (
        <p className='QuestionCard-subprompt'>{questionData.question}</p>
      )}

      <form className='QuestionCard-form' onSubmit={captureInput}>
        <div className='TableStyle-table'>
          <div className='TableStyle-row TableStyle-row--head'>
            <span className='TableStyle-head-cell instrument-badge'>
              STATEMENT
            </span>
            <span className='TableStyle-head-cell is-center instrument-badge'>
              {questionData.conditions[0]}
            </span>
            <span className='TableStyle-head-cell is-center instrument-badge'>
              {questionData.conditions[1]}
            </span>
          </div>

          {questionData.answerChoices.map((quote, idx) => {
            const radioGroupName = `q-${questionData.id}-row-${idx}`;
            const trueInputId = `${radioGroupName}-true`;
            const falseInputId = `${radioGroupName}-false`;
            return (
              <div key={quote} className='TableStyle-row'>
                <label htmlFor={trueInputId} className='TableStyle-statement'>
                  {quote}
                </label>

                <label
                  htmlFor={trueInputId}
                  className={`TableStyle-cell ${
                    selectedByRow[quote] === 'true' ? 'is-selected' : ''
                  }`}
                >
                  <input
                    type='radio'
                    id={trueInputId}
                    name={radioGroupName}
                    value='true'
                    checked={selectedByRow[quote] === 'true'}
                    onChange={() => handleChange(quote, 'true')}
                  />
                  <span className='TableStyle-mobile-cond'>
                    {questionData.conditions[0]}
                  </span>
                </label>

                <label
                  htmlFor={falseInputId}
                  className={`TableStyle-cell ${
                    selectedByRow[quote] === 'false' ? 'is-selected' : ''
                  }`}
                >
                  <input
                    type='radio'
                    id={falseInputId}
                    name={radioGroupName}
                    value='false'
                    checked={selectedByRow[quote] === 'false'}
                    onChange={() => handleChange(quote, 'false')}
                  />
                  <span className='TableStyle-mobile-cond'>
                    {questionData.conditions[1]}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        <div className='QuestionCard-actions'>
          <button
            type='submit'
            className='QuestionCard-submit-btn instrument-badge'
            disabled={!allRowsSelected}
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

export default TableStyle;
