import { RouteObject, Navigate } from 'react-router-dom';
import HomePage from '../../pages/home';
import LogInPage from '../../pages/login';
import SignUpPage from '../../pages/register';
import { UsersDataTable } from '../../components/users/data-table';
import { E_ROLE } from '../../api/user/types';
import { CoursesDataTable } from '../../components/courses/data-table';
import { CourseInfo } from '../../components/courses/course-info';
import { courseManageRoles } from '../hooks/course/useCoursePermissions';
import { ClassesDataTable } from '../../components/classes/data-table';
import { classManageRoles } from '../hooks/class/useClassPermissions';
import { ProfileUserInfo } from '../../components/profile/user-info';
import { MarkdownHelp } from '../../pages/help/markdown-help';
import { ScheduleCommon } from '../../pages/schedule-common/schedule-common';

export type TAppRoute = RouteObject & {
  path: string;
  label: string;
  showInNav?: boolean;
  bottomNav?: boolean;
  noPadding?: boolean;
  roles?: Array<E_ROLE>;
};

export const appRoutes: Array<TAppRoute> = [
  {
    path: '/',
    label: 'Home',
    showInNav: false,
    element: <Navigate to={'/schedule'} />,
  },
  {
    path: '/schedule',
    label: 'Common Schedule',
    element: <ScheduleCommon />,
    noPadding: true,
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
    path: '/courses/:id',
    label: 'Course info',
    roles: [...courseManageRoles, E_ROLE.SCHEDULER, E_ROLE.STUDENT],
    showInNav: false,
    element: <CourseInfo />,
  },
  {
    path: '/classes',
    label: 'Classes',
    roles: [...classManageRoles],
    element: <ClassesDataTable />,
  },
  {
    path: '/schedule/:mode/:id',
    label: 'Schedule',
    showInNav: false,
  },
  {
    path: '/profile',
    label: 'Profile',
    roles: [
      E_ROLE.ADMIN,
      E_ROLE.GUARANTOR,
      E_ROLE.TEACHER,
      E_ROLE.SCHEDULER,
      E_ROLE.STUDENT,
    ],
    bottomNav: true,
    element: <ProfileUserInfo />,
  },
  {
    path: '/help',
    label: 'Help',
    bottomNav: true,
    element: <MarkdownHelp />,
  },
];
