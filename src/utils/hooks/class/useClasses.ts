import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TClass } from '../../../api/class/types';
import ClassService from '../../../api/class/class.service';

export const useClasses = (
  options?: Omit<
    UseQueryOptions<Array<TClass>, TApiError, Array<TClass>, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TClass>, TApiError> => {
  return useQuery(
    ['getClasses'],
    async (): Promise<Array<TClass>> => ClassService.getClasses(),
    options,
  );
};
