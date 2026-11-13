import { LoneStarMark, ThemeToggle } from './BrandIcons';
import '../styles/LoneStarHeader.css';

const LoneStarHeader = () => {
  return (
    <header className='LoneStarHeader'>
      <div className='LoneStarHeader-inner'>
        <div className='LoneStarHeader-brand'>
          <LoneStarMark />
          <span className='LoneStarHeader-eyebrow instrument-badge'>
            TEXAS EDUCATION AGENCY // STAAR 2.0 ENGLISH II
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default LoneStarHeader;
