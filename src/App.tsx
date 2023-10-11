import React, { ReactElement } from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import LogInPage from './pages/login';
import HomePage from './pages/home';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LogInPage />,
  },
];

const App = (): ReactElement | null => {
  return useRoutes(routes);
};

export default App;
