import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { toast } from 'react-hot-toast';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../api/class/types';
import ClassService, {
  TClassCreateMutationVariables,
  TClassDeleteMutationVariables,
  TClassUpdateMutationVariables,
} from '../../api/class/class.service';

export type TUseClassMutationsParams = {
  refetch(): Promise<unknown>;
  closeFormModal(): void;
};

export type TUseClassMutations = {
  createMutation: UseMutationResult<
    TClass,
    TApiError,
    TClassCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TClass,
    TApiError,
    TClassUpdateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TClassDeleteMutationVariables
  >;
};

export const useClassMutations = ({
  refetch,
  closeFormModal,
}: TUseClassMutationsParams): TUseClassMutations => {
  const createMutation = useMutation<
    TClass,
    TApiError,
    TClassCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TClassCreateMutationVariables) =>
      ClassService.createClass(createData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Class created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create class');
    },
  });

  const updateMutation = useMutation<
    TClass,
    TApiError,
    TClassUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_CLASS_ENTITY_KEYS.ABBR]: abbr,
      data: updateData,
    }: TClassUpdateMutationVariables) =>
      ClassService.updateClass(abbr, updateData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Class updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update class');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TClassDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_CLASS_ENTITY_KEYS.ABBR]: abbr,
    }: TClassDeleteMutationVariables) => ClassService.deleteClass(abbr),
    onSuccess: async () => {
      await refetch();

      toast.success('Class deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete class');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
