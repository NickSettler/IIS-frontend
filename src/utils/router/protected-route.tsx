import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
} from '../../api/user/types';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { map, some } from 'lodash';
import { userHasRoles } from '../auth/roles';

export type TProtectedRouteProps = {
  user: TApiUserWithRoles | null;
  roles: Array<E_ROLE>;
  children: ReactNode;
};

const ProtectedRoute = ({
  user,
  roles,
  children,
}: TProtectedRouteProps): ReactNode => {
  if (!user) return <Navigate to={'/login'} />;

  const hasRoles = userHasRoles(user, roles);

  if (!hasRoles) return <Navigate to={'/'} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
