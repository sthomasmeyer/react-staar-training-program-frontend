import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

// Smoke test:
it('renders without crashing', () => {
  render(<LoginForm />, { wrapper: MemoryRouter });
});

it('renders w/ expected JSX', () => {
  render(<LoginForm />, { wrapper: MemoryRouter });

  expect(screen.getByText('Login')).toBeInTheDocument();
});
