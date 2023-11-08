import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../../api/base/types';
import { toast } from 'react-hot-toast';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../../api/teacher-requirements/types';
import TeacherRequirementsService, {
  TTeacherRequirementCreateMutationVariables,
  TTeacherRequirementDeleteMutationVariables,
  TTeacherRequirementUpdateMutationVariables,
} from '../../../api/teacher-requirements/teacher-requirements.service';

export type TUseTeacherReqMutationsParams = {
  refetch(): Promise<unknown>;
  closeFormModal(): void;
};

export type TUseTeacherReqMutations = {
  createMutation: UseMutationResult<
    TTeacherRequirement,
    TApiError,
    TTeacherRequirementCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TTeacherRequirement,
    TApiError,
    TTeacherRequirementUpdateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TTeacherRequirementDeleteMutationVariables
  >;
};

export const useTeacherRequirementMutations = ({
  refetch,
  closeFormModal,
}: TUseTeacherReqMutationsParams): TUseTeacherReqMutations => {
  const createMutation = useMutation<
    TTeacherRequirement,
    TApiError,
    TTeacherRequirementCreateMutationVariables
  >({
    mutationFn: async ({
      data: createData,
    }: TTeacherRequirementCreateMutationVariables) =>
      TeacherRequirementsService.create(createData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Teacher requirement created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create teacher requirement');
    },
  });

  const updateMutation = useMutation<
    TTeacherRequirement,
    TApiError,
    TTeacherRequirementUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TTeacherRequirementUpdateMutationVariables) =>
      TeacherRequirementsService.update(id, updateData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Teacher requirement updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update teacher requirement');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TTeacherRequirementDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: id,
    }: TTeacherRequirementDeleteMutationVariables) =>
      TeacherRequirementsService.delete(id),
    onSuccess: async () => {
      await refetch();

      toast.success('Teacher requirement deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete teacher requirement');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
