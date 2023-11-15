import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  E_TEACHER_REQUIREMENT_MODE,
  TTeacherRequirement,
} from '../../api/teacher-requirements/types';
import { groupBy, map, transform } from 'lodash';

export type TGroupedTeacherRequirements = {
  [E_TEACHER_REQUIREMENT_MODE.INCLUDE]: string;
  [E_TEACHER_REQUIREMENT_MODE.EXCLUDE]: string;
};

export const groupTeacherRequirements = (
  items: Array<TTeacherRequirement>,
): TGroupedTeacherRequirements => {
  const grouped = groupBy(items, E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE);

  return transform(
    grouped,
    (result, group, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[key] = map(
        group,
        (item) =>
          `${item[
            E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME
          ].toLocaleString()} - ${item[
            E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME
          ].toLocaleString()}`,
      );
    },
    {} as TGroupedTeacherRequirements,
  );
};
