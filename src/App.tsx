import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './App.css';
import { appRoutes } from './utils/router/routes';
import {
  AppBar,
  CssBaseline,
  Drawer,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from './utils/router/link';
import LocalStorage from './utils/local-storage';

const App = (): ReactElement => {
  const handleLogout = () => {
    LocalStorage.clear();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap={true} component='div'>
            Schedule Planner
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: 240,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <>
              {appRoutes.map(({ path, label }) => (
                <ListItem
                  key={path}
                  disablePadding={true}
                  component={Link}
                  button={true}
                  to={path}
                >
                  <ListItemButton>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding={true}>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </ListItem>
            </>
          </List>
        </Box>
      </Drawer>

      <Box component='main' sx={{ flexGrow: 1, px: 3 }}>
        <Toolbar />
        <Box sx={{ flexGrow: 1, py: 1 }}>
          <Routes>
            {appRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} Component={Component} />
            ))}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
