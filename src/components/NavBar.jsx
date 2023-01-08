import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <div className='NavBar'>
      <div id='home' className='NavBar-element'>
        <NavLink
          className='NavBar-link'
          style={{ textDecoration: 'none' }}
          to={`/english_two/modules`}
        >
          Home
        </NavLink>
      </div>
      <div className='NavBar-element'>
        <p>{'\u{272F}'}</p>
      </div>
      <div id='profile' className='NavBar-element'>
        <NavLink
          className='NavBar-link'
          style={{ textDecoration: 'none' }}
          to={`/profile`}
        >
          Profile
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default NavBar;
