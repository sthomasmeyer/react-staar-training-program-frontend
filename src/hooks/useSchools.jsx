import { useEffect, useState } from 'react';
import { fetchSchools } from '../api/staarApi';

const useSchools = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadSchools() {
      try {
        const data = await fetchSchools();
        if (!isCancelled) {
          setSchools(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSchools();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return schools;
};

export default useSchools;
