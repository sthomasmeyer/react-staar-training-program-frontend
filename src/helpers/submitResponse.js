import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

async function submitResponse(subject, responseData) {
  try {
    let response = await axios.post(
      `${BASE_API_URL}/responses/${subject}`,
      responseData
    );
    console.log(
      `[success] response submitted for Question No. ${response.data.newResponse.questionId}`
    );
  } catch (err) {
    console.log(err);
  }
}

export default submitResponse;
