import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListOfModules from '../components/ListOfModules';

// Smoke test:
it('renders without crashing', async () => {
  render(<ListOfModules subject={'english_two'} />, {
    wrapper: MemoryRouter
  });
});
