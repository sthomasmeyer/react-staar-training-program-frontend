import { useCallback, useEffect, useState } from 'react';
import { fetchModuleAttemptState } from '../api/staarApi';

const useModuleAttemptState = (subject, moduleId, userId) => {
  const [attemptState, setAttemptState] = useState(null);

  const load = useCallback(async () => {
    const data = await fetchModuleAttemptState(subject, moduleId, userId);
    setAttemptState(data);
    return data;
  }, [subject, moduleId, userId]);

  useEffect(() => {
    let isCancelled = false;
    setAttemptState(null);

    fetchModuleAttemptState(subject, moduleId, userId)
      .then((data) => {
        if (!isCancelled) {
          setAttemptState(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      isCancelled = true;
    };
  }, [subject, moduleId, userId]);

  return { attemptState, setAttemptState, reload: load };
};

export default useModuleAttemptState;
