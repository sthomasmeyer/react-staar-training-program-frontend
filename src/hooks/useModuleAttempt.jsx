import { useEffect, useState } from 'react';
import { fetchAttemptById } from '../api/staarApi';

const useModuleAttempt = (subject, moduleId, attemptId, userId) => {
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    let isCancelled = false;
    setResult(undefined);

    fetchAttemptById(subject, moduleId, attemptId, userId)
      .then((data) => {
        if (!isCancelled) {
          setResult(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!isCancelled) {
          setResult({ attempt: null });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [subject, moduleId, attemptId, userId]);

  return result;
};

export default useModuleAttempt;
