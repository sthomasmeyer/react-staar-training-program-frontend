import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('staar-training-platform-jwt');
    if (token) {
      setTokenExists(true);
      setIsLoading(false);
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <main className='App-main'>
        <p className='instrument-badge' role='status'>
          VERIFYING SESSION…
        </p>
      </main>
    );
  }

  return tokenExists ? component : null;
};

export default ProtectedRoute;
