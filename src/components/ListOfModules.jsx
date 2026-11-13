import { NavLink } from 'react-router-dom';
import useModuleList from '../hooks/useModuleList';
import useAllPerformanceDataByUser from '../hooks/useAllPerformanceDataByUser';
import ModulePreview from '../components/ModulePreview';
import NavBar from './NavBar';
import '../styles/ListOfModules.css';

// English II is currently the sole supported subject, so its module catalog
// serves as the authenticated landing page.
const ListOfModules = ({ subject }) => {
  const userId = sessionStorage.getItem('staar-training-platform-user-id');
  const modules = useModuleList(subject);
  const allPerformanceData = useAllPerformanceDataByUser(subject, userId);

  if (!modules) {
    return (
      <div className='ListOfModules-shell'>
        <NavBar />
        <main className='ListOfModules'>
          <p className='ListOfModules-loading instrument-badge'>
            LOADING CURRICULUM MODULES…
          </p>
        </main>
      </div>
    );
  }

  const performanceByModule = {};
  for (const item of allPerformanceData?.allPerformanceData || []) {
    performanceByModule[item.moduleId] = item;
  }

  return (
    <div className='ListOfModules-shell'>
      <NavBar />
      <main className='ListOfModules'>
        <header className='ListOfModules-header'>
          <span className='ListOfModules-eyebrow instrument-badge'>
            CURRICULUM CATALOG // {modules.modules.length} MODULES AVAILABLE
          </span>
          <h1 className='ListOfModules-title'>English II Practice Modules</h1>
          <p className='ListOfModules-subtitle'>
            Select a module to inspect the full passage alongside interactive
            STAAR 2.0 questions aligned to Texas Essential Knowledge and Skills
            (TEKS).
          </p>
        </header>

        <section
          className='ListOfModules-grid'
          aria-label='Available Practice Modules'
        >
          {modules.modules.map((module) => (
            <NavLink
              key={module.id}
              className='ListOfModules-card-link'
              to={`/${subject}/modules/${module.id}`}
            >
              <ModulePreview
                subject={subject}
                id={module.id}
                performance={performanceByModule[module.id] || null}
              />
            </NavLink>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ListOfModules;
