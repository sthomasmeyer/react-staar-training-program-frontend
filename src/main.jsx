import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorElement from './components/ErrorElement';
import App from './App';
import NewUserForm from './components/NewUserForm';
import ProtectedRoute from './components/ProtectedRoute';
import EngTwoModule from './components/EngTwoModule';
import ListOfModules from './components/ListOfModules';
import UserProfile from './components/UserProfile';
import { ThemeProvider } from './context/ThemeContext';
import './styles/index.css';

// English II is currently the sole supported subject, so '/english_two/modules'
// serves as the authenticated landing page.
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorElement />
  },
  {
    path: '/register',
    element: <NewUserForm />
  },
  {
    path: '/english_two/modules',
    element: (
      <ProtectedRoute component={<ListOfModules subject={'english_two'} />} />
    )
  },
  {
    path: '/english_two/modules/:id',
    element: <ProtectedRoute component={<EngTwoModule />} />,
    errorElement: <ErrorElement />
  },
  {
    path: '/profile',
    element: <ProtectedRoute component={<UserProfile />} />
  }
]);

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
