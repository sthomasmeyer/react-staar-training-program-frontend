import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useModuleList = (subject) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState([]);

  // let params = useParams();

  useEffect(() => {
    // let subject = params.subject;

    async function getModulesBySubject(targetSubject) {
      try {
        let allModules = await axios.get(`${BASE_API_URL}/modules/${subject}`);
        setModules(allModules.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getModulesBySubject(subject);
  }, [subject]);

  if (isLoading) {
    return null;
  }

  return modules;
};

export default useModuleList;
