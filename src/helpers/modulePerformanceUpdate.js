import axios from 'axios';

let BASE_API_URL = 'https://english-two-staar-training.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

async function modulePerformanceUpdate(subject, performanceData) {
  try {
    let response = await axios.patch(
      `${BASE_API_URL}/modules/${subject}/update`,
      performanceData
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

export default modulePerformanceUpdate;
