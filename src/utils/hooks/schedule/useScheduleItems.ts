import { TApiError } from '../../../api/base/types';
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  E_SCHEDULE_ITEM_ENTITY_KEYS,
  TScheduleItem,
} from '../../../api/schedule/types';
import { E_COURSE_ACTIVITY_FORM } from '../../../api/course-activities/types';
import { E_COURSE_ENTITY_KEYS } from '../../../api/course/types';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { map } from 'lodash';
import { applyTransforms, transformDate } from '../../react-query/transforms';

const templateData: Array<TScheduleItem> = [
  {
    [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: '1',
    [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: {
      id: '59f5342f-c4a3-420e-98a2-4603accdc8b3',
      form: E_COURSE_ACTIVITY_FORM.SEMINAR,
      requirements: '',
      course: {
        id: '9ae5a999-d8eb-470a-884f-003de7d75241',
        abbr: 'IDS',
        name: 'Database Systems',
        credits: 5,
        annotation: 'Database Systems Annotation',
        [E_COURSE_ENTITY_KEYS.GUARANTOR]: {
          id: 'db325bed-c4e3-48f1-be1b-b29967ce7c75',
          username: 'john.smith',
          [E_USER_ENTITY_KEYS.FIRST_NAME]: 'John',
          [E_USER_ENTITY_KEYS.LAST_NAME]: 'Smith',
        },
        teachers: [
          {
            id: 'db325bed-c4e3-48f1-be1b-b29967ce7c75',
            username: 'john.smith',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'John',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'Smith',
          },
          {
            id: '82a67b51-3a66-4c12-8fed-db635ea42ca0',
            username: 'teacher.one',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'One',
          },
          {
            id: 'ceb91498-3fb2-4524-8e55-0c1b7f485375',
            username: 'teacher.two',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'Two',
          },
        ],
      },
    },
    [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: {
      id: '171c546f-cf84-4ccb-aee2-32ac6abc3051',
      abbr: 'A112',
      capacity: 64,
    },
    [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: {
      id: 'ceb91498-3fb2-4524-8e55-0c1b7f485375',
      username: 'teacher.two',
      [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
      [E_USER_ENTITY_KEYS.LAST_NAME]: 'Two',
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [E_SCHEDULE_ITEM_ENTITY_KEYS.START_TIME]: '2023-10-01T13:00:00.000Z',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [E_SCHEDULE_ITEM_ENTITY_KEYS.END_TIME]: '2023-10-01T16:00:00.000Z',
  },
  {
    [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: '2',
    [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: {
      id: 'bbed4af6-a4bd-48c6-b486-7255c349db98',
      form: E_COURSE_ACTIVITY_FORM.LECTURE,
      requirements: '',
      course: {
        id: '9ae5a999-d8eb-470a-884f-003de7d75241',
        abbr: 'IDS',
        name: 'Database Systems',
        credits: 5,
        annotation: 'Database Systems Annotation',
        [E_COURSE_ENTITY_KEYS.GUARANTOR]: {
          id: 'db325bed-c4e3-48f1-be1b-b29967ce7c75',
          username: 'john.smith',
          [E_USER_ENTITY_KEYS.FIRST_NAME]: 'John',
          [E_USER_ENTITY_KEYS.LAST_NAME]: 'Smith',
        },
        teachers: [
          {
            id: 'db325bed-c4e3-48f1-be1b-b29967ce7c75',
            username: 'john.smith',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'John',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'Smith',
          },
          {
            id: '82a67b51-3a66-4c12-8fed-db635ea42ca0',
            username: 'teacher.one',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'One',
          },
          {
            id: 'ceb91498-3fb2-4524-8e55-0c1b7f485375',
            username: 'teacher.two',
            [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
            [E_USER_ENTITY_KEYS.LAST_NAME]: 'Two',
          },
        ],
      },
    },
    [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: {
      id: '171c546f-cf84-4ccb-aee2-32ac6abc3051',
      abbr: 'A112',
      capacity: 64,
    },
    [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: {
      id: 'ceb91498-3fb2-4524-8e55-0c1b7f485375',
      username: 'teacher.two',
      [E_USER_ENTITY_KEYS.FIRST_NAME]: 'Teacher',
      [E_USER_ENTITY_KEYS.LAST_NAME]: 'Two',
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [E_SCHEDULE_ITEM_ENTITY_KEYS.START_TIME]: '2023-10-01T13:00:00.000Z',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [E_SCHEDULE_ITEM_ENTITY_KEYS.END_TIME]: '2023-10-01T16:00:00.000Z',
  },
];

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
    async (): Promise<Array<TScheduleItem>> => templateData,
    {
      ...options,
      select: (d) => map(d, applyTransforms(transformDate).bind(this)),
    },
  );
};
