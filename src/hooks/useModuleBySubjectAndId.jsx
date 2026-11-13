import { useEffect, useState } from 'react';
import { fetchModuleBySubjectAndId } from '../api/staarApi';

const useModuleBySubjectAndId = (subject, id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [module, setModule] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadModule() {
      try {
        const data = await fetchModuleBySubjectAndId(subject, id);
        if (!isCancelled) {
          setModule(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadModule();
    return () => {
      isCancelled = true;
    };
  }, [subject, id]);

  if (isLoading) {
    return null;
  }

  return module;
};

export default useModuleBySubjectAndId;
