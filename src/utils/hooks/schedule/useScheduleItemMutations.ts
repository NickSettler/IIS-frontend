import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../../api/base/types';
import { toast } from 'react-hot-toast';
import {
  E_SCHEDULE_ITEM_ENTITY_KEYS,
  TScheduleItem,
} from '../../../api/schedule/types';
import {
  TScheduleItemCreateMutationVariables,
  TScheduleItemDeleteMutationVariables,
  TScheduleItemUpdateMutationVariables,
} from '../../../api/schedule/schedule.service';

export type TUseScheduleItemMutationsParams = {
  refetch(): Promise<unknown>;
};

export type TUseScheduleItemMutations = {
  createMutation: UseMutationResult<
    TScheduleItem,
    TApiError,
    TScheduleItemCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TScheduleItem,
    TApiError,
    TScheduleItemUpdateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TScheduleItemDeleteMutationVariables
  >;
};

export const useScheduleItemMutations = ({
  refetch,
}: TUseScheduleItemMutationsParams): TUseScheduleItemMutations => {
  const createMutation = useMutation<
    TScheduleItem,
    TApiError,
    TScheduleItemCreateMutationVariables
  >({
    mutationFn: async ({
      data: createData,
    }: TScheduleItemCreateMutationVariables) => {
      console.log('Create mutation', createData);
      return {} as TScheduleItem;
    },
    onSuccess: async () => {
      await refetch();

      toast.success('New schedule item created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create schedule item');
    },
  });

  const updateMutation = useMutation<
    TScheduleItem,
    TApiError,
    TScheduleItemUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TScheduleItemUpdateMutationVariables) => {
      console.log('Update mutation', id, updateData);
      return {} as TScheduleItem;
    },
    onSuccess: async () => {
      await refetch();

      toast.success('Schedule item updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update schedule item');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TScheduleItemDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: id,
    }: TScheduleItemDeleteMutationVariables) => {
      console.log('Delete mutation', id);
      return;
    },
    onSuccess: async () => {
      await refetch();

      toast.success('Schedule item deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete schedule item');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
