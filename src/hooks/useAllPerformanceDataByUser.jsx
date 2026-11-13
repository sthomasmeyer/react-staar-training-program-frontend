import { useEffect, useState } from 'react';
import { fetchAllPerformanceDataByUser } from '../api/staarApi';

const useAllPerformanceDataByUser = (subject, userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allPerformanceData, setAllPerformanceData] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadAllPerformanceData() {
      try {
        const data = await fetchAllPerformanceDataByUser(subject, userId);
        if (!isCancelled) {
          setAllPerformanceData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadAllPerformanceData();
    return () => {
      isCancelled = true;
    };
  }, [subject, userId]);

  if (isLoading) {
    return null;
  }

  return allPerformanceData;
};

export default useAllPerformanceDataByUser;
