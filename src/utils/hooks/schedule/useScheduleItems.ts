import { TApiError } from '../../../api/base/types';
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TScheduleItem } from '../../../api/schedule/types';
import { map } from 'lodash';
import { applyTransforms, transformDate } from '../../react-query/transforms';
import ScheduleService from '../../../api/schedule/schedule.service';

export const useScheduleItems = (
  options?: Omit<
    UseQueryOptions<
      Array<TScheduleItem>,
      TApiError,
      Array<TScheduleItem>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TScheduleItem>, TApiError> => {
  return useQuery(
    ['getSchedule'],
    async (): Promise<Array<TScheduleItem>> => ScheduleService.getAll(),
    {
      ...options,
      select: (d) => map(d, applyTransforms(transformDate).bind(this)),
    },
  );
};
