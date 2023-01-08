import React from 'react';
import useTextByModuleId from '../hooks/useTextByModuleId';
import '../styles/Text.css';

const Text = ({ module }) => {
  const text = useTextByModuleId(module);

  if (!text) return <h3>Loading...</h3>;

  if (text) {
    return (
      <div className='Text'>
        <div
          className='Text-context'
          dangerouslySetInnerHTML={{ __html: text.text.context }}
        ></div>
        <h1>{text.text.title}</h1>
        <h3>Author: {text.text.author}</h3>
        <div
          className='Text-body'
          dangerouslySetInnerHTML={{ __html: text.text.content }}
        ></div>
      </div>
    );
  }
};

export default Text;
