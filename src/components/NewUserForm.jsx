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
  const [showPwd, setShowPwd] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schools = useSchools();
  const navigate = useNavigate();

  const confirmMismatch =
    confirmTouched &&
    formData.confirmPwd.length > 0 &&
    formData.pwd !== formData.confirmPwd;

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
              <div className='AuthCard-field'>
                <label
                  htmlFor='email'
                  className='AuthCard-label instrument-badge'
                >
                  EMAIL ADDRESS
                </label>
                <input
                  className='AuthCard-input'
                  type='email'
                  id='email'
                  name='email'
                  autoComplete='username'
                  spellCheck={false}
                  autoCapitalize='none'
                  enterKeyHint='next'
                  placeholder='student@school.edu'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='AuthCard-field'>
                <label
                  htmlFor='schoolId'
                  className='AuthCard-label instrument-badge'
                >
                  SCHOOL
                </label>
                <select
                  className='AuthCard-input NewUserPage-select'
                  id='schoolId'
                  name='schoolId'
                  value={formData.schoolId}
                  onChange={handleChange}
                  required
                >
                  {schools.schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.schoolName}
                    </option>
                  ))}
                </select>
              </div>

              <div id='password-rules' className='NewUserPage-rules'>
                <span className='NewUserPage-rules-title instrument-badge'>
                  PASSWORD REQUIREMENTS
                </span>
                <ul>
                  <li>At least eight characters</li>
                  <li>Both upper- and lower-case letters</li>
                  <li>At least one number and no spaces</li>
                </ul>
              </div>

              <div className='AuthCard-field'>
                <label
                  htmlFor='pwd'
                  className='AuthCard-label instrument-badge'
                >
                  PASSWORD
                </label>
                <div className='AuthCard-input-wrap'>
                  <input
                    className='AuthCard-input AuthCard-input--with-toggle'
                    type={showPwd ? 'text' : 'password'}
                    id='pwd'
                    name='pwd'
                    autoComplete='new-password'
                    minLength={8}
                    pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{8,}'
                    aria-describedby='password-rules'
                    enterKeyHint='next'
                    value={formData.pwd}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type='button'
                    className='AuthCard-pwd-toggle instrument-badge'
                    aria-pressed={showPwd}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPwd((prev) => !prev)}
                  >
                    {showPwd ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div className='AuthCard-field'>
                <label
                  htmlFor='confirm-password'
                  className='AuthCard-label instrument-badge'
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  className='AuthCard-input'
                  type={showPwd ? 'text' : 'password'}
                  id='confirm-password'
                  name='confirmPwd'
                  autoComplete='new-password'
                  enterKeyHint='done'
                  value={formData.confirmPwd}
                  onChange={handleChange}
                  onBlur={() => setConfirmTouched(true)}
                  aria-invalid={confirmMismatch ? 'true' : undefined}
                  aria-describedby={
                    confirmMismatch ? 'confirm-password-error' : undefined
                  }
                  required
                />
                {confirmMismatch && (
                  <p id='confirm-password-error' className='AuthCard-field-error'>
                    Passwords do not match.
                  </p>
                )}
              </div>

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
