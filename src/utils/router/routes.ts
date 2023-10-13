import { RouteObject } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';

export type TAppRoute = RouteObject & {
  path: string;
  label: string;
};

export const appRoutes: Array<TAppRoute> = [
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
