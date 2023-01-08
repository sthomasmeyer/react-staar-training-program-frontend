import React from 'react';
import { NavLink } from 'react-router-dom';
import useModuleList from '../hooks/useModuleList';
import ModulePreview from '../components/ModulePreview';
import NavBar from './NavBar';
import '../styles/ListOfModules.css';

// In the current version of this app, there is *only* one subject -- English II...
// So, this list of English II modules will serve as the de facto landing page.

// In the future, there will be more subjects -- English I, U.S. History, etc...
// So, the landing page will consist of subjects that students can choose to study.
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
