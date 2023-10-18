import { RouteObject } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';
import SignUpPage from '../../pages/register';
import { UsersDataTable } from '../../components/users/data-table';
import { E_ROLE } from '../../api/user/types';

export type TAppRoute = RouteObject & {
  path: string;
  label: string;
  roles?: Array<E_ROLE>;
};

export const appRoutes: Array<TAppRoute> = [
  {
    path: '/',
    label: 'Home',
    element: <HomePage />,
  },
  {
    path: '/login',
    label: 'Login',
    element: <LogInPage />,
  },
  {
    path: '/register',
    label: 'Register',
    element: <SignUpPage />,
  },
  {
    path: '/users',
    label: 'Users',
    roles: [E_ROLE.ADMIN],
    element: <UsersDataTable />,
  },
];
