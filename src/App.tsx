import React, { ReactElement } from 'react';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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
        <Link to='/'>
          <ListItemButton>
            <ListItemText primary='Home' />
          </ListItemButton>
        </Link>
        <Link to='/login'>
          <ListItemButton>
            <ListItemText primary='Login' />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  );
};

const App = (): ReactElement | null => {
  return (
    <div
      className='page'
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Routes>
        {routes.map(({ path }) => (
          <Route key={path} path={path} element={<SideBarMenu />} />
        ))}
      </Routes>

      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
