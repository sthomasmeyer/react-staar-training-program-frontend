import { useEffect, useState } from 'react';
import axios from 'axios';

let BASE_API_URL = 'https://english-two-staar-training.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useModulePerformanceByUser = (subject, moduleId, userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    async function getModulePerformanceByUser(targetSubject, moduleId, userId) {
      try {
        let userPerformance = await axios.get(
          `${BASE_API_URL}/modules/${targetSubject}/${moduleId}/${userId}`
        );
        setPerformanceData(userPerformance.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getModulePerformanceByUser(subject, moduleId, userId);
  }, [subject, moduleId, userId]);

  if (isLoading) {
    return null;
  }

  return performanceData;
};

export default useModulePerformanceByUser;
