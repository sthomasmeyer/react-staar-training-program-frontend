import { useEffect, useState } from 'react';
import { fetchModulesBySubject } from '../api/staarApi';

const useModuleList = (subject) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadModules() {
      try {
        const data = await fetchModulesBySubject(subject);
        if (!isCancelled) {
          setModules(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadModules();
    return () => {
      isCancelled = true;
    };
  }, [subject]);

  if (isLoading) {
    return null;
  }

  return modules;
};

export default useModuleList;
