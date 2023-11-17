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
import { useCurrentScheduleDate } from '../../utils/hooks/schedule/useCurrentScheduleDate';
import {
  convertAppointmentToScheduleBody,
  convertScheduleToAppointment,
} from '../../utils/schedule/converts';
import { useSchedulePermissions } from '../../utils/hooks/schedule/useSchedulePermissions';
import { useTeacherInstances } from '../../utils/hooks/user/useTeacherInstances';
import { toast } from 'react-hot-toast';
import { ScheduleDateEditor } from './schedule-date-editor';
import { ScheduleResourceEditor } from './schedule-resource-editor';
import { useScheduleItemMutations } from '../../utils/hooks/schedule/useScheduleItemMutations';
import { SchedulerRecurrenceMenu } from './scheduler-recurrence-menu';

export type TScheduleCalendarProps = {
  items: Array<TScheduleItem>;
  refetch(): Promise<unknown>;
};

export const ScheduleCalendar = ({
  items,
  refetch,
}: TScheduleCalendarProps): JSX.Element => {
  const { createMutation, updateMutation, deleteMutation } =
    useScheduleItemMutations({
      refetch,
    });

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
    if (deleted) {
      await deleteMutation
        .mutateAsync({
          [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: `${deleted}`,
        })
        .catch(() => {});

      setItemsState(itemsState.filter((item) => item.id !== deleted));
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

      await updateMutation
        .mutateAsync({
          [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: `${key}`,
          data: updateData,
        })
        .catch(() => {});

      const index = itemsState.findIndex((item) => item.id === key);

      setItemsState((prev) => [
        ...prev.slice(0, index),
        { ...prev[index], ...changed[key] },
        ...prev.slice(index + 1),
      ]);
    }

    if (added && isAppointmentModel(added)) {
      const startingAddedId = generateScheduleItemID(itemsState);

      const createData = await convertAppointmentToScheduleBody(
        added,
        'create',
      ).catch((err: Error) => {
        toast.error(err.message);
      });

      if (!createData) return;

      await createMutation
        .mutateAsync({
          data: createData,
        })
        .catch(() => {});

      setItemsState([...itemsState, { id: startingAddedId, ...added }]);
    }

    await refetch();
  };

  const canManage = useMemo(
    () => canCreate || canUpdate || canDelete,
    [canCreate, canUpdate, canDelete],
  );

  const fixScroll = () => {
    document.getElementById('main-content')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const Comp = () => <>asd</>;

  return (
    <Scheduler data={itemsState} firstDayOfWeek={1}>
      <ViewState
        currentDate={currentScheduleDate}
        onCurrentDateChange={handleCurrentScheduleDateChange}
      />

      {canManage && <EditingState onCommitChanges={handleCommitChanges} />}
      {canManage && <EditRecurrenceMenu />}

      <WeekView startDayHour={6} endDayHour={23} />

      <Toolbar />
      <DateNavigator />
      <TodayButton />

      <Appointments />
      <AppointmentTooltip
        showCloseButton
        showOpenButton={canUpdate}
        showDeleteButton={canDelete}
        headerComponent={Comp}
      />
      {canManage && (
        <AppointmentForm
          dateEditorComponent={ScheduleDateEditor}
          resourceEditorComponent={ScheduleResourceEditor}
          onVisibilityChange={fixScroll}
        />
      )}

      <Resources
        data={resources}
        mainResourceName={E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY}
      />
    </Scheduler>
  );
};
