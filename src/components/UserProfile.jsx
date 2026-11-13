import React from 'react';
import NavBar from './NavBar';
import useUserInfoById from '../hooks/useUserInfoById';
import useSchools from '../hooks/useSchools';
import useAllPerformanceDataByUser from '../hooks/useAllPerformanceDataByUser';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const userId = sessionStorage.getItem('staar-training-platform-user-id');
  const navigate = useNavigate();

  const userInfo = useUserInfoById(userId);
  const schools = useSchools();
  const allPerformanceData = useAllPerformanceDataByUser('english_two', userId);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (!userInfo || !allPerformanceData || !schools) {
    return <h3>Loading...</h3>;
  }

  const matchedSchool = schools.schools.find(
    (s) => s.id === Number(userInfo.user.schoolId)
  );
  const schoolName =
    matchedSchool?.schoolName || schools.schools[0]?.schoolName || 'N/A';

  return (
    <div className='UserProfile'>
      <NavBar />
      <div className='UserProfile-banner'>
        <h1> </h1>
      </div>
      <div className='UserProfile-main'>
        <div className='UserProfile-main-acct-info'>
          <h2>Email Address: {userInfo.user.email}</h2>
          <h3>School: {schoolName}</h3>
        </div>
        <div className='UserProfile-main-divider'></div>
        <div className='UserProfile-main-performance-data'>
          <div className='UserProfile-main-performance-data-completed-modules'>
            <h4>Completed Modules</h4>
            <ul>
              {allPerformanceData.allPerformanceData.map((data) => (
                <li key={data.moduleId}>
                  <strong>{data.moduleId}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className='UserProfile-main-performance-data-first-attempt'>
            <h5>First-attempt Performance</h5>
            <ul>
              {allPerformanceData.allPerformanceData.map((data) => (
                <li key={data.moduleId}>
                  {(Number(data.firstAttempt) * 100).toFixed(2)} %
                </li>
              ))}
            </ul>
          </div>
          <div className='UserProfile-main-performance-data-best-overall'>
            <h5>All-time Best Performance</h5>
            <ul>
              {allPerformanceData.allPerformanceData.map((data) => (
                <li key={data.moduleId}>
                  {(Number(data.bestOverall) * 100).toFixed(2)} %
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='UserProfile-main-performance-data-logout-btn'>
          <button type='button' onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
