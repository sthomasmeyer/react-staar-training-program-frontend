import React from 'react';
import { NavLink } from 'react-router-dom';
import useModuleList from '../hooks/useModuleList';
import ModulePreview from '../components/ModulePreview';
import NavBar from './NavBar';
import '../styles/ListOfModules.css';

// English II is currently the sole supported subject, so its module catalog
// serves as the authenticated landing page.
const ListOfModules = ({ subject }) => {
  const modules = useModuleList(subject);

  if (!modules) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className='ListOfModules'>
      <NavBar />
      <div className='ListOfModules-banner'>
        <h1>Welcome to the STAAR 2.0 Training Platform</h1>
      </div>
      <div className='ListOfModules-main'>
        {modules.modules.map((module) => (
          <div key={module.id} className='ListOfModules-main-module'>
            <NavLink
              style={{ textDecoration: 'none' }}
              to={`/${subject}/modules/${module.id}`}
            >
              <ModulePreview subject={subject} id={module.id} />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfModules;
