import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, IS_REMOTE_API } from '../api/staarApi';
import '../styles/LoginForm.css';

const INITIAL_STATE = {
  email: '',
  pwd: ''
};

const LoginForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setErrorMsg(null);
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  async function loginUser(credentials) {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const userToken = await authenticateUser(credentials);
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
      setErrorMsg('Unable to sign in with those credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const captureInput = (evt) => {
    evt.preventDefault();
    loginUser({ ...formData });
  };

  const handleDemoLogin = () => {
    loginUser({ email: 'student@kipp.org', pwd: 'demo-session' });
  };

  return (
    <div className='AuthCard'>
      <div className='AuthCard-header'>
        <h2 className='AuthCard-title'>Student Sign In</h2>
        <p className='AuthCard-subtitle'>
          Resume your English II modules and performance ledger.
        </p>
      </div>

      {errorMsg && (
        <div className='AuthCard-error' role='alert'>
          {errorMsg}
        </div>
      )}

      <form className='AuthCard-form' onSubmit={captureInput}>
        <div className='AuthCard-field'>
          <label htmlFor='email' className='AuthCard-label instrument-badge'>
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
            placeholder='student@kipp.org'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className='AuthCard-field'>
          <label htmlFor='password' className='AuthCard-label instrument-badge'>
            PASSWORD
          </label>
          <div className='AuthCard-input-wrap'>
            <input
              className='AuthCard-input AuthCard-input--with-toggle'
              type={showPwd ? 'text' : 'password'}
              id='password'
              name='pwd'
              autoComplete='current-password'
              enterKeyHint='done'
              placeholder='Enter your password'
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

        <button
          type='submit'
          className='AuthCard-primary-btn instrument-badge'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      {!IS_REMOTE_API && (
        <div className='AuthCard-demo'>
          <button
            type='button'
            className='AuthCard-demo-btn instrument-badge'
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            ENTER DEMO SESSION (student@kipp.org)
          </button>
        </div>
      )}

      <div className='AuthCard-footer'>
        <span>New to the STAAR 2.0 Training Platform?</span>
        <button
          type='button'
          className='AuthCard-link-btn instrument-badge'
          onClick={() => navigate('/register')}
        >
          CREATE ACCOUNT
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
