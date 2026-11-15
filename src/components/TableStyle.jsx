import { useState } from 'react';
import QuestionCardHeader from './QuestionCardHeader';
import '../styles/TableStyle.css';

const buildInitialRows = (choices, savedUserResponse) => {
  if (!Array.isArray(savedUserResponse)) {
    return {};
  }
  const initial = {};
  for (const quote of choices) {
    initial[quote] = savedUserResponse.includes(quote) ? 'true' : 'false';
  }
  return initial;
};

const TableStyle = ({
  questionData,
  savedUserResponse,
  onSaveAnswer,
  questionNumForDisplay,
  hasSavedResponse,
  isLastQuestion
}) => {
  const [selectedByRow, setSelectedByRow] = useState(() =>
    buildInitialRows(questionData.answerChoices, savedUserResponse)
  );

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
      .map(([quote]) => quote)
      .sort();

    onSaveAnswer(questionData, isSelected);
  };

  const allRowsSelected =
    Object.keys(selectedByRow).length === questionData.answerChoices.length;

  const tableRegionLabelId = `table-region-label-${questionData.id}`;

  return (
    <div className='QuestionCard TableStyle'>
      <QuestionCardHeader
        questionData={questionData}
        questionNumForDisplay={questionNumForDisplay}
        hasSavedResponse={hasSavedResponse}
        promptOverride={questionData.directions}
      />

      {questionData.question && (
        <p id={tableRegionLabelId} className='QuestionCard-subprompt'>
          {questionData.question}
        </p>
      )}

      <form className='QuestionCard-form' onSubmit={captureInput}>
        <div
          className='TableStyle-wrapper'
          tabIndex={0}
          role='region'
          aria-labelledby={questionData.question ? tableRegionLabelId : undefined}
          aria-label={
            !questionData.question ? 'Statement classification matrix' : undefined
          }
        >
          <table className='TableStyle-table'>
            <caption className='visually-hidden'>
              Classify each statement under {questionData.conditions[0]} or{' '}
              {questionData.conditions[1]}.
            </caption>
            <thead>
              <tr className='TableStyle-row TableStyle-row--head'>
                <th
                  scope='col'
                  className='TableStyle-head-cell instrument-badge'
                >
                  STATEMENT
                </th>
                <th
                  scope='col'
                  className='TableStyle-head-cell is-center instrument-badge'
                >
                  {questionData.conditions[0]}
                </th>
                <th
                  scope='col'
                  className='TableStyle-head-cell is-center instrument-badge'
                >
                  {questionData.conditions[1]}
                </th>
              </tr>
            </thead>

            <tbody>
              {questionData.answerChoices.map((quote, idx) => {
                const radioGroupName = `q-${questionData.id}-row-${idx}`;
                const trueInputId = `${radioGroupName}-true`;
                const falseInputId = `${radioGroupName}-false`;
                return (
                  <tr key={quote} className='TableStyle-row'>
                    <th scope='row' className='TableStyle-statement'>
                      {quote}
                    </th>

                    <td className='TableStyle-td'>
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
                          aria-label={`${quote} — ${questionData.conditions[0]}`}
                          onChange={() => handleChange(quote, 'true')}
                        />
                        <span className='TableStyle-mobile-cond'>
                          {questionData.conditions[0]}
                        </span>
                      </label>
                    </td>

                    <td className='TableStyle-td'>
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
                          aria-label={`${quote} — ${questionData.conditions[1]}`}
                          onChange={() => handleChange(quote, 'false')}
                        />
                        <span className='TableStyle-mobile-cond'>
                          {questionData.conditions[1]}
                        </span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
