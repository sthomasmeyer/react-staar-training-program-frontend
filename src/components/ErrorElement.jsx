import { useNavigate, useRouteError } from 'react-router-dom';
import LoneStarHeader from './LoneStarHeader';
import '../styles/ErrorElement.css';

const ErrorElement = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className='ErrorPage'>
      <LoneStarHeader />
      <main className='ErrorPage-main'>
        <div className='ErrorPage-card' role='alert'>
          <span className='ErrorPage-badge instrument-badge'>
            NAVIGATION FAULT // ROUTE ERROR
          </span>
          <h1 className='ErrorPage-title'>Houston, we have a problem.</h1>
          <p className='ErrorPage-message'>
            {error?.statusText ||
              error?.message ||
              'An unexpected error occurred while loading this view.'}
          </p>
          <button
            type='button'
            className='ErrorPage-btn instrument-badge'
            onClick={() => navigate('/')}
          >
            RETURN TO SIGN IN
          </button>
        </div>
      </main>
    </div>
  );
};

export default ErrorElement;
