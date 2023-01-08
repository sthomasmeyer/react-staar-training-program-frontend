import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Smoke test:
it('renders without crashing', () => {
  render(<App />, { wrapper: MemoryRouter });
});
