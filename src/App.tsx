import React, { ReactElement } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import LogInPage from './pages/login';
import HomePage from './pages/home';

import './App.css';

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

const sideBarMenuItems = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/login',
    label: 'Login',
  },
];

const SideBarMenu = (): ReactElement => {
  return (
    <Box
      component='nav'
      sx={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <List>
        {sideBarMenuItems.map(({ path, label }) => (
          <Link to={path || '/'} key={label}>
            <ListItemButton>
              <ListItemText primary={label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
};

const App = (): ReactElement => {
  return (
    <div
      className='page'
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <SideBarMenu />

      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
