import { useEffect, useState } from 'react';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useResponsesByUser = (subject, userId, moduleId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    async function getUserResponses(targetSubject, userId, moduleId) {
      try {
        let userResponses = await axios.get(
          `${BASE_API_URL}/responses/${subject}/${userId}/${moduleId}`
        );
        console.log(userResponses.data);
        setResponses(userResponses.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getUserResponses(subject, userId, moduleId);
  }, [subject, userId, moduleId]);

  if (isLoading) {
    return null;
  }

  return responses;
};

export default useResponsesByUser;
