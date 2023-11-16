import {
  E_SCHEDULE_ITEM_ENTITY_KEYS,
  TScheduleItem,
} from '../../api/schedule/types';
import { AppointmentModel } from '@devexpress/dx-react-scheduler';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../../api/course-activities/types';
import { E_COURSE_ENTITY_KEYS } from '../../api/course/types';
import { E_CLASS_ENTITY_KEYS } from '../../api/class/types';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';
import {
  TScheduleItemCreateData,
  TScheduleItemUpdateData,
} from '../../api/schedule/schedule.service';
import dayjs from 'dayjs';

export const convertScheduleToAppointment = (
  scheduleItem: TScheduleItem,
): AppointmentModel => {
  const courseActivity =
    scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY];
  const course = courseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE];

  const title = `${course[E_COURSE_ENTITY_KEYS.NAME]} - ${
    courseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]
  }`;

  const courseActivityID =
    scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY][
      E_COURSE_ACTIVITY_ENTITY_KEYS.ID
    ];

  const classID =
    scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS][E_CLASS_ENTITY_KEYS.ID];

  const teacherID =
    scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER][E_USER_ENTITY_KEYS.ID];

  return {
    id: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.ID],
    title: title,
    startDate: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.START_TIME],
    endDate: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.END_TIME],
    ...(scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.RECURRENCE_RULE] && {
      rRule: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.RECURRENCE_RULE],
    }),
    ...(scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.EXCLUSION_DATES] && {
      exDate: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.EXCLUSION_DATES],
    }),
    ...(scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.NOTES] && {
      notes: scheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.NOTES],
    }),
    [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: courseActivityID,
    [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: classID,
    [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: teacherID,
  };
};

export const convertAppointmentToScheduleBody = async <
  Mode extends 'create' | 'update',
>(
  appointment: AppointmentModel,
  mode: Mode,
): Promise<
  Mode extends 'create' ? TScheduleItemCreateData : TScheduleItemUpdateData
> =>
  new Promise<
    Mode extends 'create' ? TScheduleItemCreateData : TScheduleItemUpdateData
  >((resolve, reject) => {
    const startDate = dayjs(appointment.startDate);
    const endDate = dayjs(appointment.endDate);

    let startDateString: string;
    try {
      startDateString = startDate.toISOString();
    } catch (error) {
      reject(new Error('Invalid start date format'));
      return;
    }

    let endDateString: string;
    try {
      endDateString = endDate.toISOString();
    } catch (error) {
      reject(new Error('Invalid end date format'));
      return;
    }

    resolve({
      ...(appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY] && {
        [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]:
          appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY],
      }),
      ...(appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS] && {
        [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]:
          appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS],
      }),
      ...(appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER] && {
        [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]:
          appointment[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER],
      }),
      [E_SCHEDULE_ITEM_ENTITY_KEYS.RECURRENCE_RULE]: appointment.rRule,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.EXCLUSION_DATES]: appointment.exDate,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.NOTES]: appointment.notes,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.START_TIME]: startDateString,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.END_TIME]: endDateString,
    });
  });
