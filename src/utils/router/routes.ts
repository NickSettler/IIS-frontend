import { RouteObject } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';
import SignUpPage from '../../pages/register';

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
  {
    path: '/register',
    label: 'Register',
    Component: SignUpPage,
  },
];
