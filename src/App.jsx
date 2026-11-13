import './styles/App.css';
import LoneStarHeader from './components/LoneStarHeader';
import LoginForm from './components/LoginForm';

const App = () => {
  return (
    <div className='App'>
      <LoneStarHeader />
      <main className='App-main'>
        <section className='App-intro'>
          <span className='App-kicker instrument-badge'>
            OPEN-SOURCE ASSESSMENT STUDIO
          </span>
          <h1 className='App-headline'>STAAR 2.0 Training Platform</h1>
          <p className='App-lead'>
            Practice all five redesigned Texas English II question formats—from
            paired reading passages and two-part evidence to inline text entry
            and statement classification.
          </p>
        </section>

        <section className='App-auth-panel'>
          <LoginForm />
        </section>
      </main>
    </div>
  );
};

export default App;
