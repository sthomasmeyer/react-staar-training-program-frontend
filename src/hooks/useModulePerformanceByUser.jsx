import { useEffect, useState } from 'react';
import { fetchModulePerformanceByUser } from '../api/staarApi';

const useModulePerformanceByUser = (subject, moduleId, userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadPerformance() {
      try {
        const data = await fetchModulePerformanceByUser(
          subject,
          moduleId,
          userId
        );
        if (!isCancelled) {
          setPerformanceData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadPerformance();
    return () => {
      isCancelled = true;
    };
  }, [subject, moduleId, userId]);

  if (isLoading) {
    return null;
  }

  return performanceData;
};

export default useModulePerformanceByUser;
