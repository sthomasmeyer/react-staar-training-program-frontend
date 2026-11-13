import { useTheme } from '../context/ThemeContext';

export function LoneStarMark() {
  return (
    <svg
      className='Brand-star-icon'
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='10' opacity='0.35' />
      <polygon
        points='12 4.8 14.05 9.65 19.3 10.1 15.3 13.55 16.5 18.7 12 15.95 7.5 18.7 8.7 13.55 4.7 10.1 9.95 9.65'
        fill='currentColor'
        stroke='none'
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className='ThemeToggle-icon'
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='4.5' />
      <line x1='12' y1='2' x2='12' y2='4.5' />
      <line x1='12' y1='19.5' x2='12' y2='22' />
      <line x1='4.93' y1='4.93' x2='6.7' y2='6.7' />
      <line x1='17.3' y1='17.3' x2='19.07' y2='19.07' />
      <line x1='2' y1='12' x2='4.5' y2='12' />
      <line x1='19.5' y1='12' x2='22' y2='12' />
      <line x1='4.93' y1='19.07' x2='6.7' y2='17.3' />
      <line x1='17.3' y1='6.7' x2='19.07' y2='4.93' />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className='ThemeToggle-icon'
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <button
      type='button'
      className='ThemeToggle instrument-badge'
      onClick={toggleTheme}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      <span>{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
    </button>
  );
}
