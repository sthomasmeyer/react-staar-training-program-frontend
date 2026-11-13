import { Outlet, NavLink } from 'react-router-dom';
import { LoneStarMark, ThemeToggle } from './BrandIcons';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <header className='NavBar-shell'>
      <nav className='NavBar' aria-label='Primary Navigation'>
        <div className='NavBar-brand'>
          <NavLink className='NavBar-brand-link' to='/english_two/modules'>
            <LoneStarMark />
            <span className='NavBar-brand-text instrument-badge'>
              STAAR 2.0 // ENGLISH II
            </span>
          </NavLink>
        </div>

        <div className='NavBar-links'>
          <NavLink
            to='/english_two/modules'
            end
            className={({ isActive }) =>
              `NavBar-link instrument-badge ${isActive ? 'is-active' : ''}`
            }
          >
            MODULES
          </NavLink>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `NavBar-link instrument-badge ${isActive ? 'is-active' : ''}`
            }
          >
            PROFILE
          </NavLink>
        </div>

        <div className='NavBar-actions'>
          <ThemeToggle />
        </div>
      </nav>
      <Outlet />
    </header>
  );
};

export default NavBar;
