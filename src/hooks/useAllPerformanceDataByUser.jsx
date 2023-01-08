import { useEffect, useState } from 'react';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useAllPerformanceDataByUser = (subject, userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allPerformanceData, setAllPerformanceData] = useState([]);

  useEffect(() => {
    async function getAllPerformanceData(targetSubject, userId) {
      try {
        let res = await axios.get(
          `${BASE_API_URL}/modules/${targetSubject}/module_performance/user/${userId}`
        );
        setAllPerformanceData(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getAllPerformanceData(subject, userId);
  }, [subject, userId]);

  if (isLoading) {
    return null;
  }

  return allPerformanceData;
};

export default useAllPerformanceDataByUser;
