import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  TApiUserWithRoles,
  TApiUserWithTeacherRequirements,
} from '../../../api/user/types';
import UserService from '../../../api/user/user.service';
import { applyTransforms, transformDate } from '../../react-query/transforms';
import { map } from 'lodash';

export const useTeachers = (
  options?: Omit<
    UseQueryOptions<
      Array<TApiUserWithTeacherRequirements>,
      TApiError,
      Array<TApiUserWithTeacherRequirements>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TApiUserWithTeacherRequirements>, TApiError> => {
  return useQuery(
    ['getTeachers'],
    async (): Promise<Array<TApiUserWithTeacherRequirements>> =>
      UserService.getTeachers(),
    {
      ...options,
      select: (d) => map(d, applyTransforms(transformDate).bind(this)),
    },
  );
};
