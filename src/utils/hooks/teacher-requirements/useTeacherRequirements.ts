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
): UseQueryResult<Array<TTeacherRequirement>, TApiError> => {
  return useQuery(
    ['teacher-requirements'],
    async (): Promise<Array<TTeacherRequirement>> =>
      TeacherRequirementsService.getAll(),
    {
      ...options,
      select: (d) => map(d, applyTransforms(transformDate).bind(this)),
    },
  );
};
