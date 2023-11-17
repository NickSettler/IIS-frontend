import { ResourceInstance } from '@devexpress/dx-react-scheduler';
import { useClasses } from './useClasses';
import { E_CLASS_ENTITY_KEYS } from '../../../api/class/types';

export const useClassInstances = (): Array<ResourceInstance> => {
  const { data } = useClasses();

  if (!data) return [];

  return data.map((classItem) => ({
    id: classItem[E_CLASS_ENTITY_KEYS.ID],
    text: classItem[E_CLASS_ENTITY_KEYS.ABBR],
  }));
};
