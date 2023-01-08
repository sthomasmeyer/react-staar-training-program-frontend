import { useEffect, useState } from 'react';
import useTextByModuleId from '../hooks/useTextByModuleId';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import '../styles/ModulePreview.css';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const ModulePreview = ({ subject, id }) => {
  const INITIAL_STATE = {
    id: '',
    moduleName: ''
  };

  const [isLoading, setIsLoading] = useState(true);
  const [moduleInfo, setModuleInfo] = useState(INITIAL_STATE);

  const text = useTextByModuleId(id);
  const questions = useQuestionsByModuleId(id);

  useEffect(() => {
    async function getModuleInfo(targetSubject, moduleId) {
      try {
        let moduleInfo = await axios.get(
          `${BASE_API_URL}/modules/${subject}/${id}`
        );
        setModuleInfo(moduleInfo.data.targetModule[0]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getModuleInfo(subject, id);
  }, [subject, id]);

  if (!text || !questions || isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className='ModulePreview'>
      <div className='ModulePreview-banner'>
        <h1>{moduleInfo.id}</h1>
        <h1>{moduleInfo.moduleName}</h1>
      </div>
      <div className='ModulePreview-text'>
        {text.text.publicationDate ? (
          <h2>
            Featured Text: "{text.text.title}" ({text.text.publicationDate})
          </h2>
        ) : (
          <h2>Featured Text: "{text.text.title}"</h2>
        )}
        {text.text.author ? (
          <h3>
            <em>Author: {text.text.author}</em>
          </h3>
        ) : null}
        <div className='ModulePreview-text-border'></div>
      </div>
      <div className='ModulePreview-questions'>
        <h2>{questions.questions.length} Questions</h2>
        <h4>Aligned TEKS: </h4>
        <ul>
          {questions ? (
            questions.questions.map((question) => (
              <li key={uuid()}>{question.alignedStandards}</li>
            ))
          ) : (
            <li key={uuid()}>
              You'll find no aligned standards here, my friend.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModulePreview;
