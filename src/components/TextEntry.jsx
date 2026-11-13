import { useState } from 'react';
import QuestionCardHeader from './QuestionCardHeader';
import '../styles/TextEntry.css';

const TextEntry = ({
  questionData,
  savedUserResponse,
  onSaveAnswer,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [userGeneratedAnswer, setUserGeneratedAnswer] = useState(
    () => savedUserResponse?.[0] || ''
  );

  const ncmpltStatement = questionData.incompleteStatement.split('<input>');
  const promptText = questionData.question || questionData.directions;

  const handleChange = (evt) => {
    const cleanVal = evt.target.value.toLowerCase().replace(/\s+/g, '');
    setUserGeneratedAnswer(cleanVal);
  };

  const captureInput = (evt) => {
    evt.preventDefault();
    onSaveAnswer(questionData, [userGeneratedAnswer]);
  };

  return (
    <div className='QuestionCard TextEntry'>
      <QuestionCardHeader
        questionData={questionData}
        questionNumForDisplay={questionNumForDisplay}
        hasSavedResponse={hasSavedResponse}
        promptOverride={promptText}
      />

      <form className='QuestionCard-form' onSubmit={captureInput}>
        <div className='TextEntry-slot-card'>
          <p className='TextEntry-sentence'>
            {ncmpltStatement[0]}
            <input
              type='text'
              id={`text-entry-${questionData.id}`}
              className='TextEntry-input'
              name='userGeneratedAnswer'
              value={userGeneratedAnswer}
              onChange={handleChange}
              placeholder='type word'
              aria-label='Enter missing word from passage'
              autoComplete='off'
              spellCheck='false'
            />
            {ncmpltStatement[1]}
          </p>
        </div>

        <div className='QuestionCard-actions'>
          <button
            type='submit'
            className='QuestionCard-submit-btn instrument-badge'
            disabled={!userGeneratedAnswer.trim()}
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

export default TextEntry;
