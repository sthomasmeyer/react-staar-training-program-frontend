// Import the aligned text.
import Text from './Text';

// Import relevant question-type Components.
import TraditionalMultipleChoice from './TraditionalMultipleChoice';
import MultiSelect from './MultiSelect';
import TwoPart from './TwoPart';
import TextEntry from './TextEntry';
import TableStyle from './TableStyle';

// Import the 'NavBar' Component (+) the relevant CSS.
import NavBar from './NavBar';
import '../styles/EngTwoModule.css';

// Import React Hooks:
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import useModuleBySubjectAndId from '../hooks/useModuleBySubjectAndId';
import useModulePerformanceByUser from '../hooks/useModulePerformanceByUser';

// Import helpers:
import firstAttemptSubmission from '../helpers/firstAttemptSubmission';
import modulePerformanceUpdate from '../helpers/modulePerformanceUpdate';

const EngTwoModule = ({ moduleId }) => {
  const [hasViewedAllQuestions, setHasViewedAllQuestions] = useState(false);
  const [responses, setResponses] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(1);

  const navigate = useNavigate();
  const params = useParams();

  const questions = useQuestionsByModuleId(params.id);
  const module = useModuleBySubjectAndId('english_two', params.id);
  const userPerformanceData = useModulePerformanceByUser(
    'english_two',
    params.id,
    sessionStorage.getItem('staar-training-platform-user-id')
  );

  const trackResponse = (response) => {
    // Has a response to this question been submitted already?
    for (let i = 0; i < Object.keys(responses).length; i++) {
      if (response.questionId === responses[i].questionId) {
        responses.splice(i, 1);
      }
    }

    setResponses((responses) => [...responses, response]);
    if (responses.length + 1 === questions.questions.length) {
      setHasViewedAllQuestions(true);
    }

    /* If (and when) a response is submitted, automatically re-direct users to the next Q */

    // This 'short circuit' if-statement checks to see if the submitted response is aligned...
    // to the first question. If it is, then Q1 is immediately hidden.
    if (selectedQuestionId === 1) {
      document.getElementById(1).style.display = 'none';
    }

    // Use the [setSelectedQuestionId()] function to keep track of the [id] of the currently...
    // selected question.
    setSelectedQuestionId(selectedQuestionId + 1);

    let questionContainer = document.getElementsByClassName(
      'EngTwoModule-questions-main'
    );

    // Cycle through the <div> elements that are aligned to each question.
    for (let i = 1; i <= questionContainer[0].children.length; i++) {
      // If the currently-selected question is the final question in the module, break this...
      // loop before additional commands are executed.
      if (selectedQuestionId + 1 > questionContainer[0].children.length) {
        break;
      }
      // Reveal the next question to the user by adjusting its 'class' attribute, Ensure that...
      // all other questions are hidden.
      i === selectedQuestionId + 1
        ? document
            .getElementById(i)
            .setAttribute(
              'class',
              'EngTwoModule-questions-main-question--selected'
            )
        : document
            .getElementById(i)
            .setAttribute('class', 'EngTwoModule-questions-main-question');
    }
  };

  const selectQuestion = (evt) => {
    evt.preventDefault();

    // Track the [id] of the selected question. Note, this [setSelectedQuestionId()] function...
    // is executed if, and only if, the active user actually clicks the nav-buttons.
    setSelectedQuestionId(+evt.target.innerText.replace(/Q/g, ''));

    if (responses.length + 1 === questions.questions.length) {
      setHasViewedAllQuestions(true);
    }

    +evt.target.innerText.replace(/Q/g, '') === 1
      ? (document.getElementById(1).style.display = 'unset')
      : (document.getElementById(1).style.display = 'none');

    let questionContainer = document.getElementsByClassName(
      'EngTwoModule-questions-main'
    );

    for (let i = 1; i <= questionContainer[0].children.length; i++) {
      i === +evt.target.innerText.replace(/Q/g, '')
        ? document
            .getElementById(i)
            .setAttribute(
              'class',
              'EngTwoModule-questions-main-question--selected'
            )
        : document
            .getElementById(i)
            .setAttribute('class', 'EngTwoModule-questions-main-question');
    }
  };

  if (!questions || !module) {
    return <p>Loading...</p>;
  }

  const updateModulePerformance = (evt) => {
    evt.preventDefault();
    evt.target.style.pointerEvents = 'none';

    let totalPossiblePoints = 0;
    for (let i = 0; i < questions.questions.length; i++) {
      totalPossiblePoints += questions.questions[i].totalPossiblePoints;
    }

    let totalPointsEarned = 0;
    for (let i = 0; i < responses.length; i++) {
      totalPointsEarned += responses[i].pointsEarned;
    }

    // Is it the active user's first time submitting a response for this module?
    if (!userPerformanceData.userPerformanceData) {
      firstAttemptSubmission('english_two', {
        firstAttempt: totalPointsEarned / totalPossiblePoints,
        bestOverall: totalPointsEarned / totalPossiblePoints,
        moduleId: +params.id,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
    } else if (
      userPerformanceData.userPerformanceData.firstAttempt &&
      totalPointsEarned / totalPossiblePoints >
        userPerformanceData.userPerformanceData.bestOverall
    ) {
      modulePerformanceUpdate('english_two', {
        bestOverall: totalPointsEarned / totalPossiblePoints,
        moduleId: +params.id,
        userId: +sessionStorage.getItem('staar-training-platform-user-id')
      });
    }

    navigate('/english_two/modules');
  };

  return (
    <div className='EngTwoModule'>
      <NavBar />
      <div className='EngTwoModule-banner'>
        <h1>
          Module {module.targetModule[0].id}:{' '}
          {module.targetModule[0].moduleName}
        </h1>
      </div>
      <div className='EngTwoModule-text'>
        <Text module={moduleId} />
      </div>
      <div className='EngTwoModule-questions'>
        <div className='EngTwoModule-questions-navigation'>
          {questions.questions.map((question, index) => (
            <button
              key={question.id}
              className='EngTwoModule-questions-navigation-btn'
              onClick={selectQuestion}
            >
              Q{index + 1}
            </button>
          ))}
        </div>
        <div className='EngTwoModule-questions-main'>
          {questions.questions.map((question, index) =>
            question.questionType === 'multi-select' ? (
              <div
                id={index + 1}
                key={question.id}
                className='EngTwoModule-questions-main-question'
              >
                <MultiSelect
                  questionData={question}
                  recordResponse={trackResponse}
                  questionNumForDisplay={index + 1}
                />
              </div>
            ) : question.questionType === 'multiple-choice' ? (
              <div
                id={index + 1}
                key={question.id}
                className='EngTwoModule-questions-main-question'
              >
                <TraditionalMultipleChoice
                  questionData={question}
                  recordResponse={trackResponse}
                  questionNumForDisplay={index + 1}
                />
              </div>
            ) : question.questionType === 'two-part' ? (
              <div
                id={index + 1}
                key={question.id}
                className='EngTwoModule-questions-main-question'
              >
                <TwoPart
                  questionData={question}
                  recordResponse={trackResponse}
                  questionNumForDisplay={index + 1}
                />
              </div>
            ) : question.questionType === 'text-entry' ? (
              <div
                id={index + 1}
                key={question.id}
                className='EngTwoModule-questions-main-question'
              >
                <TextEntry
                  questionData={question}
                  recordResponse={trackResponse}
                  questionNumForDisplay={index + 1}
                />
              </div>
            ) : question.questionType === 'table-style' ? (
              <div
                id={index + 1}
                key={question.id}
                className='EngTwoModule-questions-main-question'
              >
                <TableStyle
                  questionData={question}
                  recordResponse={trackResponse}
                  questionNumForDisplay={index + 1}
                />
              </div>
            ) : null
          )}
        </div>
        {hasViewedAllQuestions ? (
          <div className='EngTwoModule-final-submission'>
            <p className='EngTwoModule-final-submission-warning'>
              <strong>Warning:</strong> DO NOT press this final submission
              button,{' '}
              <em>
                until you have submitted a response for every question in the
                module.
              </em>
            </p>
            <button
              id='EngTwoModule-questions-final-submit-btn'
              onClick={updateModulePerformance}
            >
              Final Moudle {moduleId} Submission
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EngTwoModule;
