import { find } from 'lodash';
import { appRoutes } from '../../router/routes';
import { useLocation } from 'react-router-dom';

export const useCurrentRoute = () => {
  const location = useLocation();

  return find(appRoutes, ({ path }) => {
    const routeParts = path.split('/');

    const locationParts = location.pathname.split('/');

    if (routeParts.length !== locationParts.length) return false;

    return routeParts.reduce((acc, param, index) => {
      if (!acc) return false;

      if (param.startsWith(':')) return acc;

      return param === locationParts[index];
    }, true);
  });
};
