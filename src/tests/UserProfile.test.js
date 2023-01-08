import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from '../components/UserProfile';

// Smoke test:
it('renders without crashing', async () => {
  render(<UserProfile />, {
    wrapper: MemoryRouter
  });
});
