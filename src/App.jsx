import React from 'react';
import './styles/App.css';
import LoneStarHeader from './components/LoneStarHeader';
import LoginForm from './components/LoginForm';

const App = () => {
  return (
    <div className='App'>
      <LoneStarHeader />
      <div className='App-banner'>
        <h1>The STAAR 2.0 Training Platform</h1>
      </div>
      <div className='App-main'>
        <LoginForm />
      </div>
    </div>
  );
};

export default App;
