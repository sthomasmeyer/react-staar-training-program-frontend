import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function seekToken() {
      let token = await sessionStorage.getItem('staar-training-platform-jwt');
      if (token) {
        setTokenExists(true);
        setIsLoading(false);
      } else if (!token) {
        navigate('/');
      }
    }
    seekToken();
  }, [navigate]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (tokenExists) {
    return { ...component };
  }
};

export default ProtectedRoute;
