import { ResourceInstance } from '@devexpress/dx-react-scheduler';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { useTeachers } from './useTeachers';

export const useTeacherInstances = (): Array<ResourceInstance> => {
  const { data } = useTeachers();

  if (!data) return [];

  return data.map((item) => {
    const fullName = `${item[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
      item[E_USER_ENTITY_KEYS.LAST_NAME]
    }`;
    return {
      id: item[E_USER_ENTITY_KEYS.ID],
      text: `${fullName} (${item[E_USER_ENTITY_KEYS.USERNAME]})`,
      something: 'a;',
    };
  });
};
