import { useState } from 'react';
import QuestionCardHeader from './QuestionCardHeader';
import '../styles/TwoPart.css';

const TwoPart = ({
  questionData,
  savedUserResponse,
  onSaveAnswer,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [selectedAnswerOne, setSelectedAnswerOne] = useState(
    () => savedUserResponse?.[0] || ''
  );
  const [selectedAnswerTwo, setSelectedAnswerTwo] = useState(
    () => savedUserResponse?.[1] || ''
  );

  const captureInput = (evt) => {
    evt.preventDefault();
    onSaveAnswer(questionData, [selectedAnswerOne, selectedAnswerTwo]);
  };

  return (
    <div className='QuestionCard TwoPart'>
      <QuestionCardHeader
        questionData={questionData}
        questionNumForDisplay={questionNumForDisplay}
        hasSavedResponse={hasSavedResponse}
        promptOverride=''
      />

      <form className='QuestionCard-form' onSubmit={captureInput}>
        <fieldset className='TwoPart-section'>
          <legend className='TwoPart-legend'>
            <span className='TwoPart-part-pill instrument-badge'>PART A</span>
            <span>{questionData.question[0]}</span>
          </legend>
          <div className='QuestionCard-options'>
            {questionData.answerChoices[0].map((option, idx) => {
              const inputId = `q-${questionData.id}-part-a-${idx}`;
              const checked = selectedAnswerOne === option;
              return (
                <label
                  key={option}
                  htmlFor={inputId}
                  className={`QuestionCard-option ${checked ? 'is-selected' : ''}`}
                >
                  <input
                    type='radio'
                    id={inputId}
                    name={`TwoPartQ1-${questionData.id}`}
                    value={option}
                    checked={checked}
                    onChange={(evt) => setSelectedAnswerOne(evt.target.value)}
                  />
                  <span className='QuestionCard-option-text'>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className='TwoPart-section'>
          <legend className='TwoPart-legend'>
            <span className='TwoPart-part-pill instrument-badge'>PART B</span>
            <span>{questionData.question[1]}</span>
          </legend>
          <div className='QuestionCard-options'>
            {questionData.answerChoices[1].map((option, idx) => {
              const inputId = `q-${questionData.id}-part-b-${idx}`;
              const checked = selectedAnswerTwo === option;
              return (
                <label
                  key={option}
                  htmlFor={inputId}
                  className={`QuestionCard-option ${checked ? 'is-selected' : ''}`}
                >
                  <input
                    type='radio'
                    id={inputId}
                    name={`TwoPartQ2-${questionData.id}`}
                    value={option}
                    checked={checked}
                    onChange={(evt) => setSelectedAnswerTwo(evt.target.value)}
                  />
                  <span className='QuestionCard-option-text'>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className='QuestionCard-actions'>
          <button
            type='submit'
            className='QuestionCard-submit-btn instrument-badge'
            disabled={!selectedAnswerOne || !selectedAnswerTwo}
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

export default TwoPart;
