import { E_ROLE, TApiUserWithRoles } from '../../api/user/types';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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
