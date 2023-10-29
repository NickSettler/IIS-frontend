import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { toast } from 'react-hot-toast';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
} from '../../api/course-activities/types';
import CourseActivityService, {
  TCourseActivityCreateMutationVariables,
  TCourseActivityDeleteMutationVariables,
  TCourseActivityUpdateMutationVariables,
} from '../../api/course-activities/course-activities.service';

export type TUseCourseActivityMutationsParams = {
  refetch(): Promise<unknown>;
  closeFormModal(): void;
};

export type TUseCourseActivityMutations = {
  createMutation: UseMutationResult<
    TApiCourseActivity,
    TApiError,
    TCourseActivityCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TApiCourseActivity,
    TApiError,
    TCourseActivityUpdateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TCourseActivityDeleteMutationVariables
  >;
};

export const useCourseActivityMutations = ({
  refetch,
  closeFormModal,
}: TUseCourseActivityMutationsParams): TUseCourseActivityMutations => {
  const createMutation = useMutation<
    TApiCourseActivity,
    TApiError,
    TCourseActivityCreateMutationVariables
  >({
    mutationFn: async ({
      data: createData,
    }: TCourseActivityCreateMutationVariables) =>
      CourseActivityService.createCourseActivity(createData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('New activity created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create activity');
    },
  });

  const updateMutation = useMutation<
    TApiCourseActivity,
    TApiError,
    TCourseActivityUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TCourseActivityUpdateMutationVariables) =>
      CourseActivityService.updateCourseActivity(id, updateData),
    onSuccess: async () => {
      await refetch();

      toast.success('Activity updated successfully!');

      closeFormModal();
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update activity');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TCourseActivityDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
    }: TCourseActivityDeleteMutationVariables) =>
      CourseActivityService.deleteCourseActivity(id),
    onSuccess: async () => {
      await refetch();

      toast.success('Activity deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete activity');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
