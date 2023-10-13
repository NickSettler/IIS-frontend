import React, { ReactElement } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './App.css';
import { appRoutes } from './utils/router/routes';

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
        {appRoutes.map(({ path, label }) => (
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
        {appRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} Component={Component} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
