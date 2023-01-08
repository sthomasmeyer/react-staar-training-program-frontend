import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModulePreview from '../components/ModulePreview';

// Smoke test:
it('renders without crashing', async () => {
  render(<ModulePreview subject={'english_two'} id={1} />, {
    wrapper: MemoryRouter
  });
});
