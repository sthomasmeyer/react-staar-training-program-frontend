import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

// Smoke test:
it('renders without crashing', () => {
  render(<NavBar />, { wrapper: MemoryRouter });
});

it('renders w/ expected JSX', () => {
  render(<NavBar />, { wrapper: MemoryRouter });

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
});
