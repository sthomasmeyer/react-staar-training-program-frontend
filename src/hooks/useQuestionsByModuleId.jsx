import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestionsByModuleId } from '../api/staarApi';

const useQuestionsByModuleId = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  const params = useParams();

  useEffect(() => {
    let isCancelled = false;
    const moduleId = id ?? params.id;

    async function loadQuestions() {
      try {
        const data = await fetchQuestionsByModuleId(moduleId);
        if (!isCancelled) {
          setQuestions(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadQuestions();
    return () => {
      isCancelled = true;
    };
  }, [id, params.id]);

  if (isLoading) {
    return null;
  }

  return questions;
};

export default useQuestionsByModuleId;
