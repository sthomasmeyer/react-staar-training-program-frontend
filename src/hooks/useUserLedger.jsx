import { useCallback, useEffect, useState } from 'react';
import { fetchUserLedger } from '../api/staarApi';

const useUserLedger = (subject, userId) => {
  const [ledger, setLedger] = useState(null);

  const load = useCallback(async () => {
    const data = await fetchUserLedger(subject, userId);
    setLedger(data);
    return data;
  }, [subject, userId]);

  useEffect(() => {
    let isCancelled = false;
    setLedger(null);

    fetchUserLedger(subject, userId)
      .then((data) => {
        if (!isCancelled) {
          setLedger(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      isCancelled = true;
    };
  }, [subject, userId]);

  return { ledger, setLedger, reload: load };
};

export default useUserLedger;
