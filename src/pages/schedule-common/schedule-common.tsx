import { JSX } from 'react';
import { useScheduleItems } from '../../utils/hooks/schedule/useScheduleItems';
import { ScheduleCalendar } from '../../components/schedule/schedule-calendar';
import { useScheduleItemMutations } from '../../utils/hooks/schedule/useScheduleItemMutations';
import {
  TScheduleItemCreateMutationVariables,
  TScheduleItemDeleteMutationVariables,
  TScheduleItemUpdateMutationVariables,
} from '../../api/schedule/schedule.service';

export const ScheduleCommon = (): JSX.Element => {
  const { data, refetch } = useScheduleItems();

  const { createMutation, updateMutation, deleteMutation } =
    useScheduleItemMutations({
      refetch,
    });

  const handleCreate = (variables: TScheduleItemCreateMutationVariables) => {
    createMutation.mutate(variables);
  };

  const handleUpdate = (variables: TScheduleItemUpdateMutationVariables) => {
    updateMutation.mutate(variables);
  };

  const handleDelete = (variables: TScheduleItemDeleteMutationVariables) => {
    deleteMutation.mutate(variables);
  };

  return (
    <ScheduleCalendar
      items={data ?? []}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
    />
  );
};
