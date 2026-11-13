import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/staarApi';
import useSchools from '../hooks/useSchools';
import LoneStarHeader from './LoneStarHeader';
import '../styles/LoginForm.css';
import '../styles/NewUserForm.css';

const INITIAL_STATE = {
  email: '',
  schoolId: 1,
  pwd: '',
  confirmPwd: ''
};

const NewUserForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schools = useSchools();
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setErrorMsg(null);
    setFormData((data) => ({
      ...data,
      [name]: name === 'schoolId' ? Number(value) : value
    }));
  };

  async function registerNewUser(data) {
    setIsSubmitting(true);
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
      setErrorMsg('Unable to create account with those details.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const captureInput = (evt) => {
    evt.preventDefault();
    if (!formData.email.trim()) {
      setErrorMsg('Please enter an email address.');
      return;
    }
    if (formData.pwd !== formData.confirmPwd) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    registerNewUser({ ...formData });
  };

  return (
    <div className='NewUserPage'>
      <LoneStarHeader />
      <main className='NewUserPage-main'>
        {!schools ? (
          <div className='AuthCard'>
            <p className='AuthCard-subtitle'>Loading Texas school directory…</p>
          </div>
        ) : (
          <div className='AuthCard'>
            <div className='AuthCard-header'>
              <h1 className='AuthCard-title'>Create Student Account</h1>
              <p className='AuthCard-subtitle'>
                Select your campus to track module attempts and mastery scores.
              </p>
            </div>

            {errorMsg && (
              <div className='AuthCard-error' role='alert'>
                {errorMsg}
              </div>
            )}

            <form className='AuthCard-form' onSubmit={captureInput}>
              <label className='AuthCard-field'>
                <span className='AuthCard-label instrument-badge'>
                  EMAIL ADDRESS
                </span>
                <input
                  className='AuthCard-input'
                  type='email'
                  id='email'
                  name='email'
                  placeholder='student@school.edu'
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label className='AuthCard-field'>
                <span className='AuthCard-label instrument-badge'>SCHOOL</span>
                <select
                  className='AuthCard-input NewUserPage-select'
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
              </label>

              <div className='NewUserPage-rules'>
                <span className='NewUserPage-rules-title instrument-badge'>
                  PASSWORD REQUIREMENTS
                </span>
                <ul>
                  <li>At least eight characters</li>
                  <li>Both upper- and lower-case letters</li>
                  <li>At least one number and no spaces</li>
                </ul>
              </div>

              <label className='AuthCard-field'>
                <span className='AuthCard-label instrument-badge'>
                  PASSWORD
                </span>
                <input
                  className='AuthCard-input'
                  type='password'
                  id='pwd'
                  name='pwd'
                  value={formData.pwd}
                  onChange={handleChange}
                />
              </label>

              <label className='AuthCard-field'>
                <span className='AuthCard-label instrument-badge'>
                  CONFIRM PASSWORD
                </span>
                <input
                  className='AuthCard-input'
                  type='password'
                  id='confirm-password'
                  name='confirmPwd'
                  value={formData.confirmPwd}
                  onChange={handleChange}
                />
              </label>

              <button
                type='submit'
                className='AuthCard-primary-btn instrument-badge'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className='AuthCard-footer'>
              <span>Already have an account?</span>
              <button
                type='button'
                className='AuthCard-link-btn instrument-badge'
                onClick={() => navigate('/')}
              >
                LOGIN
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewUserForm;
