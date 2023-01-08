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
import './styles/index.css';

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
    // In the current version of this app, there is *only* one subject -- English II...
    // So, a list of English II modules operates as the landing page. In the future...
    // there will be more subjects, and this 'ListOfModules' Component will be replaced...
    // by a list of subjects that students can choose to study.
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

ReactDOMClient.createRoot(root.render(<RouterProvider router={router} />));
