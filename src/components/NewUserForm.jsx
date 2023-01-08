import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSchools from '../hooks/useSchools';
import '../styles/NewUserForm.css';
import LoneStarHeader from './LoneStarHeader';

let BASE_API_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_API_URL = 'http://localhost:8000';
}

const NewUserForm = () => {
  const INITIAL_STATE = {
    email: '',
    schoolId: 1,
    pwd: '',
    confirmPwd: ''
  };

  const [formData, setFormData] = useState(INITIAL_STATE);

  // Import the list of schools from the database.
  const schools = useSchools();

  let navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    // The value assigned to the 'schoolId' key must be an integer.
    if (name === 'schoolId') {
      setFormData((data) => ({
        ...data,
        [name]: +value
      }));
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value
      }));
    }
  };

  async function registerNewUser(data) {
    try {
      let newUserToken = await axios.post(
        `${BASE_API_URL}/auth/register`,
        data
      );
      // If the user-registration is successful, update sessionStorage and...
      // navigate to the landing page.
      if (newUserToken) {
        sessionStorage.setItem(
          'staar-training-platform-jwt',
          newUserToken.data.token
        );
        sessionStorage.setItem(
          'staar-training-platform-user-id',
          newUserToken.data.newUser.id
        );
        navigate('/english_two/modules');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const captureInput = (evt) => {
    evt.preventDefault();
    console.log({ ...formData });
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
                name='pwd'
                value={formData.pwd}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='confirm-password'>Confirm Password: </label>
              <input
                type='password'
                name='confirmPwd'
                value={formData.confirmPwd}
                onChange={handleChange}
              />
            </div>
            <button>Create</button>
          </form>
        </div>
        <div className='NewUserForm-login'>
          Already have an account?{' '}
          <button onClick={() => navigate('/')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;
