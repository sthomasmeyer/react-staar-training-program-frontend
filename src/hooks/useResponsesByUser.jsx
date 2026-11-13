import { useEffect, useState } from 'react';
import { fetchResponsesByUserAndModule } from '../api/staarApi';

const useResponsesByUser = (subject, userId, moduleId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadResponses() {
      try {
        const data = await fetchResponsesByUserAndModule(
          subject,
          userId,
          moduleId
        );
        if (!isCancelled) {
          setResponses(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadResponses();
    return () => {
      isCancelled = true;
    };
  }, [subject, userId, moduleId]);

  if (isLoading) {
    return null;
  }

  return responses;
};

export default useResponsesByUser;
