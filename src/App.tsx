import React, { ReactElement, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './App.css';
import { appRoutes, TAppRoute } from './utils/router/routes';
import {
  AppBar,
  CssBaseline,
  Drawer,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from './utils/router/link';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from './utils/local-storage';
import ProtectedRoute from './utils/router/protected-route';
import { TApiUserWithRoles } from './api/user/types';
import { useLocalStorage } from 'usehooks-ts';
import { filter } from 'lodash';
import { userHasRoles } from './utils/auth/roles';
import { toast, Toaster } from 'react-hot-toast';
import { useCurrentRoute } from './utils/hooks/router/useCurrentRoute';

const App = (): ReactElement => {
  const [, setAccessToken] = useLocalStorage<string | null>(
    E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    null,
  );
  const [, setRefreshToken] = useLocalStorage<string | null>(
    E_LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
    null,
  );
  const [user, setUser] = useLocalStorage<TApiUserWithRoles | null>(
    E_LOCAL_STORAGE_KEYS.USER_INFO,
    null,
  );

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    LocalStorage.clear();
  };

  const currentRoute = useCurrentRoute();

  const visibleRoutes = useMemo(
    (): Array<TAppRoute> =>
      filter(
        filter(appRoutes, ({ roles, path }) =>
          user
            ? userHasRoles(user, roles ?? null) &&
              path !== '/login' &&
              path !== '/register'
            : path === '/login' || path === '/register',
        ),
        ({ showInNav }) => showInNav ?? true,
      ),
    [user],
  );

  const topRoutes = useMemo(
    (): Array<TAppRoute> =>
      filter(visibleRoutes, ({ bottomNav }) => !bottomNav),
    [visibleRoutes],
  );

  const bottomRoutes = useMemo(
    (): Array<TAppRoute> =>
      filter(visibleRoutes, ({ bottomNav }) => !!bottomNav),
    [visibleRoutes],
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography
            component={Link}
            to={'/'}
            variant='h6'
            noWrap
            color={'inherit'}
            style={{ textDecoration: 'none' }}
          >
            Schedule Planner {currentRoute ? `- ${currentRoute.label}` : ''}
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
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <List
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <>
              {topRoutes.map(({ path, label }) => (
                <ListItem
                  key={path}
                  disablePadding
                  component={Link}
                  button
                  to={path}
                >
                  <ListItemButton>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Box flexGrow={1} />
              {bottomRoutes.map(({ path, label }) => (
                <ListItem
                  key={path}
                  disablePadding
                  component={Link}
                  button
                  to={path}
                >
                  <ListItemButton>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </ListItem>
            </>
          </List>
        </Box>
      </Drawer>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          px: currentRoute?.noPadding ? 0 : 3,
          height: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            py: currentRoute?.noPadding ? 0 : 2,
            height: 'calc(100% - 64px)',
          }}
        >
          <Routes>
            {appRoutes.map(({ path, roles, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  roles ? (
                    <ProtectedRoute user={user} roles={roles}>
                      {element}
                    </ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            ))}
          </Routes>
        </Box>
        <Toaster position='bottom-right' reverseOrder={false} />
      </Box>
    </Box>
  );
};

export default App;
