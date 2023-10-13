import { RouteObject } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';

export type AppRoute = RouteObject & {
  label: string;
};

export const appRoutes: Array<AppRoute> = [
  {
    path: '/',
    label: 'Home',
    Component: HomePage,
  },
  {
    path: '/login',
    label: 'Login',
    Component: LogInPage,
  },
];
