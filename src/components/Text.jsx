import useTextByModuleId from '../hooks/useTextByModuleId';
import '../styles/Text.css';

const Text = ({ module }) => {
  const text = useTextByModuleId(module);

  if (!text) {
    return (
      <div className='Text Text--loading'>
        <span className='instrument-badge'>LOADING PASSAGE…</span>
      </div>
    );
  }

  return (
    <article className='Text'>
      {text.text.context && (
        <div
          className='Text-context'
          dangerouslySetInnerHTML={{ __html: text.text.context }}
        />
      )}

      <header className='Text-header'>
        <h2 className='Text-title'>{text.text.title}</h2>
        {text.text.author && (
          <p className='Text-author'>By {text.text.author}</p>
        )}
      </header>

      <div
        className={`Text-body ${
          text.text.genre === 'poetry' ? 'Text-body--poetry' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: text.text.content }}
      />
    </article>
  );
};

export default Text;
