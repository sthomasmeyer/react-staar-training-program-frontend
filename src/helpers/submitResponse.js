import { submitQuestionResponse } from '../api/staarApi';

async function submitResponse(subject, responseData) {
  try {
    return await submitQuestionResponse(subject, responseData);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default submitResponse;
