import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

async function getResponsesByUserandModule(targetSubject, userId, moduleId) {
  try {
    let userResponses = await axios.get(
      `${BASE_API_URL}/responses/${targetSubject}/${userId}/${moduleId}`
    );
    console.log(userResponses.data);
  } catch (err) {
    console.log(err);
  }
}

export default getResponsesByUserandModule;
