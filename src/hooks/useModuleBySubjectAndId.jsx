import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';

let BASE_API_URL = 'https://english-two-staar-training.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useModuleBySubjectAndId = (subject, id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [module, setModule] = useState([]);

  // let params = useParams();

  useEffect(() => {
    // let subject = params.subject;

    async function getModuleBySubjectAndId(targetSubject, moduleId) {
      try {
        let module = await axios.get(
          `${BASE_API_URL}/modules/${subject}/${id}`
        );
        setModule(module.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getModuleBySubjectAndId(subject, id);
  }, [subject, id]);

  if (isLoading) {
    return null;
  }

  return module;
};

export default useModuleBySubjectAndId;
