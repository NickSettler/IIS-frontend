import { JSX, useEffect, useMemo, useState } from 'react';
import {
  E_SCHEDULE_ITEM_ENTITY_KEYS,
  TScheduleItem,
} from '../../api/schedule/types';
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  EditRecurrenceMenu,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  AppointmentModel,
  ViewState,
  Resource,
  EditingState,
  ChangeSet,
} from '@devexpress/dx-react-scheduler';
import { useClassInstances } from '../../utils/hooks/class/useClassInstances';
import { useCourseActivityInstances } from '../../utils/hooks/course-activities/useCourseActivityInstances';
import { isAppointmentModel } from '../../utils/schedule/isAppointmentModel';
import { generateScheduleItemID } from '../../utils/schedule/generateScheduleItemID';
import {
  TScheduleItemCreateMutationVariables,
  TScheduleItemDeleteMutationVariables,
  TScheduleItemUpdateMutationVariables,
} from '../../api/schedule/schedule.service';
import { useCurrentScheduleDate } from '../../utils/hooks/schedule/useCurrentScheduleDate';
import {
  convertAppointmentToScheduleBody,
  convertScheduleToAppointment,
} from '../../utils/schedule/converts';
import { useSchedulePermissions } from '../../utils/hooks/schedule/useSchedulePermissions';
import { useTeacherInstances } from '../../utils/hooks/user/useTeacherInstances';
import { toast } from 'react-hot-toast';

// export enum E_SCHEDULE_CALENDAR_MODE {
//   GENERAL = 'GENERAL',
//   TEACHER = 'TEACHER',
//   COURSE = 'COURSE',
//   COURSE_ACTIVITY = 'COURSE_ACTIVITY',
//   CLASS = 'CLASS',
// }

// export type TScheduleCalendarProps<
//   Mode extends E_SCHEDULE_CALENDAR_MODE = E_SCHEDULE_CALENDAR_MODE,
//   Entity extends Record<PropertyKey, any> = Record<PropertyKey, any>,
//   PrimaryKey extends keyof Entity = keyof Entity,
// > = Mode extends E_SCHEDULE_CALENDAR_MODE.GENERAL
//   ? {
//       mode: E_SCHEDULE_CALENDAR_MODE.GENERAL;
//       id: never;
//     }
//   : {
//       mode: Mode;
//       id: Entity[PrimaryKey];
//     };

export type TScheduleCalendarProps = {
  items: Array<TScheduleItem>;
  handleCreate(variables: TScheduleItemCreateMutationVariables): void;
  handleUpdate(variables: TScheduleItemUpdateMutationVariables): void;
  handleDelete(variables: TScheduleItemDeleteMutationVariables): void;
};

export const ScheduleCalendar = ({
  items,
  handleCreate,
  handleUpdate,
  handleDelete,
}: TScheduleCalendarProps): JSX.Element => {
  const { currentScheduleDate, handleCurrentScheduleDateChange } =
    useCurrentScheduleDate();

  const { canCreate, canUpdate, canDelete } = useSchedulePermissions();

  const courseActivityResourceInstances = useCourseActivityInstances();
  const classResourceInstances = useClassInstances();
  const teacherResourceInstances = useTeacherInstances();

  const resources: Array<Resource> = useMemo(
    () => [
      {
        title: 'Course Activity',
        fieldName: E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY,
        instances: courseActivityResourceInstances,
      },
      {
        title: 'Class',
        fieldName: E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS,
        instances: classResourceInstances,
      },
      {
        title: 'Teacher',
        fieldName: E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER,
        instances: teacherResourceInstances,
      },
    ],
    [
      courseActivityResourceInstances,
      classResourceInstances,
      teacherResourceInstances,
    ],
  );

  const [itemsState, setItemsState] = useState<Array<AppointmentModel>>([]);

  useEffect(() => {
    setItemsState(items.map(convertScheduleToAppointment));
  }, [items]);

  const handleCommitChanges = async ({
    added,
    changed,
    deleted,
  }: ChangeSet) => {
    if (added && isAppointmentModel(added)) {
      const startingAddedId = generateScheduleItemID(itemsState);

      const createData = await convertAppointmentToScheduleBody(
        added,
        'create',
      ).catch((err: Error) => {
        toast.error(err.message);
      });

      if (!createData) return;

      handleCreate({
        data: createData,
      });

      setItemsState([...itemsState, { id: startingAddedId, ...added }]);
    }

    if (changed) {
      const key = Object.keys(changed)[0] as keyof AppointmentModel;
      const current = itemsState.find((item) => item.id === key);

      const updateData = await convertAppointmentToScheduleBody(
        { ...(current ?? {}), ...changed[key] },
        'update',
      ).catch((err: Error) => {
        toast.error(err.message);
      });

      if (!updateData) return;

      handleUpdate({
        [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: `${key}`,
        data: updateData,
      });

      const index = itemsState.findIndex((item) => item.id === key);

      setItemsState((prev) => [
        ...prev.slice(0, index),
        { ...prev[index], ...changed[key] },
        ...prev.slice(index + 1),
      ]);
    }

    if (deleted) {
      handleDelete({
        [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: `${deleted}`,
      });

      setItemsState(itemsState.filter((item) => item.id !== deleted));
    }
  };

  const canManage = useMemo(
    () => canCreate || canUpdate || canDelete,
    [canCreate, canUpdate, canDelete],
  );

  return (
    <Scheduler data={itemsState} firstDayOfWeek={1}>
      <ViewState
        currentDate={currentScheduleDate}
        onCurrentDateChange={handleCurrentScheduleDateChange}
      />

      {canManage && <EditingState onCommitChanges={handleCommitChanges} />}
      {canManage && <EditRecurrenceMenu />}

      <WeekView startDayHour={6} endDayHour={21} />

      <Toolbar />
      <DateNavigator />
      <TodayButton />

      <Appointments />
      <AppointmentTooltip
        showCloseButton
        showOpenButton={canUpdate}
        showDeleteButton={canDelete}
      />
      {canManage && <AppointmentForm />}
          dateEditorComponent={ScheduleDateEditor}

      <Resources
        data={resources}
        mainResourceName={E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY}
      />
    </Scheduler>
  );
};
