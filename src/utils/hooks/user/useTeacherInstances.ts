import { ResourceInstance } from '@devexpress/dx-react-scheduler';
import { useUsers } from './useUsers';
import { applyFilters, filterTeachers } from '../../react-query/transforms';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';

export const useTeacherInstances = (): Array<ResourceInstance> => {
  const { data } = useUsers({
    select: applyFilters(filterTeachers),
  });

  if (!data) return [];

  return data.map((item) => {
    const fullName = `${item[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
      item[E_USER_ENTITY_KEYS.LAST_NAME]
    }`;
    return {
      id: item[E_USER_ENTITY_KEYS.ID],
      text: `${fullName} (${item[E_USER_ENTITY_KEYS.USERNAME]})`,
    };
  });
};
