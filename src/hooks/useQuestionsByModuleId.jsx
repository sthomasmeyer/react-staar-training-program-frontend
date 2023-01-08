import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useQuestionsByModuleId = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  let params = useParams();

  useEffect(() => {
    let moduleId;

    // If an [id] prop was *not* passed directly to this component, get it from the URL.
    id ? (moduleId = id) : (moduleId = params.id);

    async function getQuestions(id) {
      try {
        let questions = await axios.get(`${BASE_API_URL}/questions/${id}`);
        setQuestions(questions.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getQuestions(moduleId);
  }, [id, params.id]);

  if (isLoading) {
    return null;
  }

  return questions;
};

export default useQuestionsByModuleId;
