import { TApiError } from '../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../api/class/types';
import ClassService from '../../api/class/class.service';

export const useClass = (
  abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR] | undefined,
  options?: Omit<
    UseQueryOptions<
      TClass | null,
      TApiError,
      TClass | null,
      Array<string | null>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TClass | null, TApiError> => {
  return useQuery(
    ['class', abbr ?? null],
    async (): Promise<TClass | null> =>
      abbr ? ClassService.getClass(abbr) : null,
    options,
  );
};
