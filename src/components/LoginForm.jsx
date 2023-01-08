import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginForm.css';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const LoginForm = () => {
  const INITIAL_STATE = {
    email: '',
    pwd: ''
  };

  const [formData, setFormData] = useState(INITIAL_STATE);

  let navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  async function loginUser(data) {
    try {
      let userToken = await axios.post(`${BASE_API_URL}/auth/token`, data);
      // If the user's login attempt is successful, update sessionStorage and...
      // navigate to the landing page.
      if (userToken) {
        sessionStorage.setItem(
          'staar-training-platform-jwt',
          userToken.data.token
        );
        sessionStorage.setItem(
          'staar-training-platform-user-id',
          userToken.data.user.id
        );
        navigate('/english_two/modules');
      }
    } catch (err) {
      console.log(err);
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
          <button>Login</button>
        </form>
      </div>
      <div className='LoginForm-create-acct'>
        New to the STAAR 2.0 Training Platform?{' '}
        <button onClick={() => navigate('/register')}>Create Account</button>
      </div>
    </div>
  );
};

export default LoginForm;
