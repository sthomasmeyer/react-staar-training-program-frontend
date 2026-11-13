import '../styles/questionShared.css';

const ITEM_TYPE_LABELS = {
  'multi-select': 'MULTI-SELECT',
  'multiple-choice': 'MULTIPLE CHOICE',
  'two-part': 'TWO-PART EVIDENCE',
  'text-entry': 'TEXT ENTRY',
  'table-style': 'INLINE CLASSIFICATION'
};

const QuestionCardHeader = ({
  questionData,
  questionNumForDisplay,
  hasSavedResponse,
  promptOverride
}) => {
  const itemLabel =
    ITEM_TYPE_LABELS[questionData.questionType] || questionData.questionType;
  const pointSuffix = questionData.totalPossiblePoints === 1 ? 'PT' : 'PTS';
  const standards = questionData.alignedStandards?.join(', ');
  const promptText =
    promptOverride ??
    (Array.isArray(questionData.question)
      ? questionData.question[0]
      : questionData.question);

  return (
    <>
      <div className='QuestionCard-meta'>
        <div className='QuestionCard-badges'>
          <span className='QuestionCard-index instrument-badge'>
            Q{String(questionNumForDisplay).padStart(2, '0')}
          </span>
          <span className='QuestionCard-type instrument-badge'>
            {itemLabel} // {questionData.totalPossiblePoints} {pointSuffix}
          </span>
          {standards && (
            <span className='QuestionCard-teks instrument-badge'>
              TEKS {standards}
            </span>
          )}
        </div>

        {hasSavedResponse && (
          <span className='QuestionCard-status instrument-badge'>
            RESPONSE SAVED
          </span>
        )}
      </div>

      {promptText && <h3 className='QuestionCard-prompt'>{promptText}</h3>}

      {questionData.selectedText && (
        <blockquote className='QuestionCard-excerpt'>
          “{questionData.selectedText}”
        </blockquote>
      )}
    </>
  );
};

export default QuestionCardHeader;
