import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTextBySubjectAndModuleId } from '../api/staarApi';

const useTextByModuleId = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState(null);
  const params = useParams();

  useEffect(() => {
    let isCancelled = false;
    const moduleId = id ?? params.id;

    async function loadText() {
      try {
        const data = await fetchTextBySubjectAndModuleId(
          'english_two',
          moduleId
        );
        if (!isCancelled) {
          setText(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadText();
    return () => {
      isCancelled = true;
    };
  }, [id, params.id]);

  if (isLoading) {
    return null;
  }

  return text;
};

export default useTextByModuleId;
