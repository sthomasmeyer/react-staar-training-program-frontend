import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

let BASE_API_URL = 'https://english-two-staar-training.herokuapp.com';

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const useTextByModuleId = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState([]);

  let params = useParams();

  useEffect(() => {
    let moduleId;

    // If an [id] prop was *not* passed directly to this component, get it from the URL.
    id ? (moduleId = id) : (moduleId = params.id);

    async function getText(moduleId) {
      let text = await axios.get(
        `${BASE_API_URL}/texts/english_two/${moduleId}`
      );
      setText(text.data);
      setIsLoading(false);
    }
    getText(moduleId);
  }, [id, params.id]);

  if (isLoading) {
    return null;
  }

  return text;
};

export default useTextByModuleId;
