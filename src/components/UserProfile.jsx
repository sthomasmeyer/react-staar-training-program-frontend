import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import useUserInfoById from '../hooks/useUserInfoById';
import useSchools from '../hooks/useSchools';
import useModuleList from '../hooks/useModuleList';
import useAllPerformanceDataByUser from '../hooks/useAllPerformanceDataByUser';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const userId = sessionStorage.getItem('staar-training-platform-user-id');
  const navigate = useNavigate();

  const userInfo = useUserInfoById(userId);
  const schools = useSchools();
  const modulesData = useModuleList('english_two');
  const allPerformanceData = useAllPerformanceDataByUser('english_two', userId);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (!userInfo || !allPerformanceData || !schools || !modulesData) {
    return (
      <div className='UserProfile-shell'>
        <NavBar />
        <main className='UserProfile'>
          <p className='UserProfile-loading instrument-badge'>
            LOADING STUDENT LEDGER…
          </p>
        </main>
      </div>
    );
  }

  const matchedSchool = schools.schools.find(
    (s) => s.id === Number(userInfo.user.schoolId)
  );
  const schoolName =
    matchedSchool?.schoolName || schools.schools[0]?.schoolName || 'N/A';

  const moduleNameMap = {};
  for (const mod of modulesData.modules) {
    moduleNameMap[mod.id] = mod.moduleName;
  }

  const rows = allPerformanceData.allPerformanceData;
  const completedCount = rows.length;
  const avgFirstAttempt =
    completedCount > 0
      ? (rows.reduce((sum, r) => sum + Number(r.firstAttempt), 0) /
          completedCount) *
        100
      : null;
  const avgBestOverall =
    completedCount > 0
      ? (rows.reduce((sum, r) => sum + Number(r.bestOverall), 0) /
          completedCount) *
        100
      : null;

  return (
    <div className='UserProfile-shell'>
      <NavBar />
      <main className='UserProfile'>
        <section className='UserProfile-card'>
          <div className='UserProfile-header'>
            <div className='UserProfile-identity'>
              <span className='UserProfile-eyebrow instrument-badge'>
                STUDENT ACCOUNT // ENGLISH II
              </span>
              <h1 className='UserProfile-email'>{userInfo.user.email}</h1>
              <p className='UserProfile-school'>{schoolName}</p>
            </div>

            <button
              type='button'
              className='UserProfile-logout instrument-badge'
              onClick={logout}
            >
              LOG OUT
            </button>
          </div>

          <div className='UserProfile-metrics'>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                MODULES COMPLETED
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {completedCount} / {modulesData.modules.length}
              </span>
            </div>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                AVG FIRST ATTEMPT
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {avgFirstAttempt !== null
                  ? `${avgFirstAttempt.toFixed(1)}%`
                  : '--'}
              </span>
            </div>
            <div className='UserProfile-metric'>
              <span className='UserProfile-metric-label instrument-badge'>
                AVG BEST SCORE
              </span>
              <span className='UserProfile-metric-value numeric-readout'>
                {avgBestOverall !== null
                  ? `${avgBestOverall.toFixed(1)}%`
                  : '--'}
              </span>
            </div>
          </div>

          <div className='UserProfile-ledger'>
            <h2 className='UserProfile-section-title instrument-badge'>
              MODULE PERFORMANCE LEDGER
            </h2>

            {rows.length === 0 ? (
              <div className='UserProfile-empty'>
                <p>
                  You haven’t submitted a completed module yet. Complete any
                  English II module to record your first-attempt and best
                  scores.
                </p>
                <button
                  type='button'
                  className='UserProfile-browse-btn instrument-badge'
                  onClick={() => navigate('/english_two/modules')}
                >
                  BROWSE MODULES →
                </button>
              </div>
            ) : (
              <div className='UserProfile-table-wrap'>
                <div className='UserProfile-table-head instrument-badge'>
                  <span>MODULE</span>
                  <span className='is-right'>FIRST ATTEMPT</span>
                  <span className='is-right'>ALL-TIME BEST</span>
                </div>
                {rows.map((data) => {
                  const firstPct = (Number(data.firstAttempt) * 100).toFixed(1);
                  const bestPct = (Number(data.bestOverall) * 100).toFixed(1);
                  return (
                    <div key={data.moduleId} className='UserProfile-table-row'>
                      <div className='UserProfile-row-module'>
                        <span className='UserProfile-row-id instrument-badge'>
                          MOD {String(data.moduleId).padStart(2, '0')}
                        </span>
                        <span className='UserProfile-row-name'>
                          {moduleNameMap[data.moduleId] ||
                            `Module ${data.moduleId}`}
                        </span>
                      </div>
                      <span className='UserProfile-row-num numeric-readout'>
                        {firstPct}%
                      </span>
                      <span className='UserProfile-row-num UserProfile-row-num--best numeric-readout'>
                        {bestPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
