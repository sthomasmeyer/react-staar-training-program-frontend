import React from 'react';
import '../styles/LoneStarHeader.css';

// This Component is designed purely for aesthetic purposes, and is meant to be...
// used as a stand-in for the navbar.
const LoneStarHeader = () => {
  return (
    <div className='LoneStarHeader'>
      <p>{'\u{272F}'}</p>
    </div>
  );
};

export default LoneStarHeader;
