import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../api/staarApi';
import '../styles/LoginForm.css';

const INITIAL_STATE = {
  email: '',
  pwd: ''
};

const LoginForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  async function loginUser(data) {
    try {
      const userToken = await authenticateUser(data);
      if (userToken) {
        sessionStorage.setItem(
          'staar-training-platform-jwt',
          userToken.token
        );
        sessionStorage.setItem(
          'staar-training-platform-user-id',
          String(userToken.user.id)
        );
        navigate('/english_two/modules');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const captureInput = (evt) => {
    evt.preventDefault();
    loginUser({ ...formData });
    setFormData(INITIAL_STATE);
  };

  return (
    <div className='LoginForm'>
      <div className='LoginForm-main'>
        <form onSubmit={captureInput}>
          <div>
            <label htmlFor='email'>Email Address: </label>
            <input
              type='text'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              id='password'
              name='pwd'
              value={formData.pwd}
              onChange={handleChange}
            />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
      <div className='LoginForm-create-acct'>
        New to the STAAR 2.0 Training Platform?{' '}
        <button type='button' onClick={() => navigate('/register')}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
