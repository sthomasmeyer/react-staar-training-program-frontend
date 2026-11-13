import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/staarApi';
import useSchools from '../hooks/useSchools';
import '../styles/NewUserForm.css';
import LoneStarHeader from './LoneStarHeader';

const INITIAL_STATE = {
  email: '',
  schoolId: 1,
  pwd: '',
  confirmPwd: ''
};

const NewUserForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const schools = useSchools();
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: name === 'schoolId' ? Number(value) : value
    }));
  };

  async function registerNewUser(data) {
    try {
      const newUserToken = await registerUser(data);
      if (newUserToken) {
        sessionStorage.setItem(
          'staar-training-platform-jwt',
          newUserToken.token
        );
        sessionStorage.setItem(
          'staar-training-platform-user-id',
          String(newUserToken.newUser.id)
        );
        navigate('/english_two/modules');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const captureInput = (evt) => {
    evt.preventDefault();
    if (formData.pwd === formData.confirmPwd) {
      setFormData(INITIAL_STATE);
      registerNewUser({ ...formData });
    }
  };

  if (!schools) {
    return <p>Loading...</p>;
  }

  return (
    <div className='Pre-NewUserForm'>
      <LoneStarHeader />
      <div className='NewUserForm'>
        <h1>New Account</h1>
        <div className='NewUserForm-main'>
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
              <label htmlFor='schoolId'>School: </label>
              <select
                id='schoolId'
                name='schoolId'
                value={formData.schoolId}
                onChange={handleChange}
              >
                {schools.schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
            </div>
            <div className='NewUserForm-main-pwd-instructions'>
              <ol>
                <p>
                  <strong>Your password must contain:</strong>
                </p>
                <li>at least eight characters</li>
                <li>both upper- and lower-case letters</li>
                <li>at least one number</li>
                <li>no spaces</li>
              </ol>
            </div>
            <div>
              <label htmlFor='pwd'>Password: </label>
              <input
                type='password'
                id='pwd'
                name='pwd'
                value={formData.pwd}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='confirm-password'>Confirm Password: </label>
              <input
                type='password'
                id='confirm-password'
                name='confirmPwd'
                value={formData.confirmPwd}
                onChange={handleChange}
              />
            </div>
            <button type='submit'>Create</button>
          </form>
        </div>
        <div className='NewUserForm-login'>
          Already have an account?{' '}
          <button type='button' onClick={() => navigate('/')}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;
