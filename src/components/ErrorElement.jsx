import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorElement = () => {
  const error = useRouteError();

  return (
    <div className='ErrorElement'>
      <h1>Houston, we have a problem.</h1>
      <p>An unexpected error has occured!</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorElement;
