import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TTeacherRequirement } from '../../../api/teacher-requirements/types';
import TeacherRequirementsService from '../../../api/teacher-requirements/teacher-requirements.service';
import { applyTransforms, transformDate } from '../../react-query/transforms';
import { map } from 'lodash';
import { E_USER_ENTITY_KEYS, TApiUser } from '../../../api/user/types';

export const useTeacherRequirements = (
  options?: Omit<
    UseQueryOptions<
      Array<TTeacherRequirement>,
      TApiError,
      Array<TTeacherRequirement>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
  id?: TApiUser[E_USER_ENTITY_KEYS.ID] | null,
): UseQueryResult<Array<TTeacherRequirement>, TApiError> => {
  return useQuery(
    ['teacher-requirements', id ?? '_ALL'],
    async (): Promise<Array<TTeacherRequirement>> =>
      id
        ? TeacherRequirementsService.getForTeacher(id)
        : TeacherRequirementsService.getAll(),
    {
      ...options,
      select: (d) => map(d, applyTransforms(transformDate).bind(this)),
    },
  );
};
