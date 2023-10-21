import { RouteObject } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';
import SignUpPage from '../../pages/register';
import { UsersDataTable } from '../../components/users/data-table';
import { E_ROLE } from '../../api/user/types';
import { CoursesDataTable } from '../../components/courses/data-table';
import { CourseInfo } from '../../components/courses/course-info';
import { courseManageRoles } from '../hooks/useCoursePermissions';

export type TAppRoute = RouteObject & {
  path: string;
  label: string;
  showInNav?: boolean;
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
  {
    path: '/courses',
    label: 'Courses',
    roles: [...courseManageRoles, E_ROLE.SCHEDULER, E_ROLE.STUDENT],
    element: <CoursesDataTable />,
  },
  {
    path: '/courses/:abbr',
    label: 'Course info',
    roles: [...courseManageRoles, E_ROLE.SCHEDULER, E_ROLE.STUDENT],
    showInNav: false,
    element: <CourseInfo />,
  },
];
