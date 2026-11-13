import useModuleBySubjectAndId from '../hooks/useModuleBySubjectAndId';
import useTextByModuleId from '../hooks/useTextByModuleId';
import useQuestionsByModuleId from '../hooks/useQuestionsByModuleId';
import '../styles/ModulePreview.css';

const ModulePreview = ({ subject, id }) => {
  const moduleData = useModuleBySubjectAndId(subject, id);
  const text = useTextByModuleId(id);
  const questions = useQuestionsByModuleId(id);

  const moduleInfo = moduleData?.targetModule?.[0];

  if (!text || !questions || !moduleInfo) {
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
          {questions.questions.length > 0 ? (
            questions.questions.map((question) => (
              <li key={question.id}>{question.alignedStandards?.join(', ')}</li>
            ))
          ) : (
            <li>You'll find no aligned standards here, my friend.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModulePreview;
