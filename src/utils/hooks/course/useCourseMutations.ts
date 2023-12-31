import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TCourse } from '../../../api/course/types';
import { TApiError } from '../../../api/base/types';
import CourseService, {
  TCourseCreateMutationVariables,
  TCourseDeleteMutationVariables,
  TCourseUpdateMutationVariables,
} from '../../../api/course/course.service';
import { toast } from 'react-hot-toast';

export type TUseCourseMutationsParams = {
  refetch(): Promise<unknown>;
  closeFormModal(): void;
};

export type TUseCourseMutations = {
  createMutation: UseMutationResult<
    TCourse,
    TApiError,
    TCourseCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TCourse,
    TApiError,
    TCourseUpdateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TCourseDeleteMutationVariables
  >;
};

export const useCourseMutations = ({
  refetch,
  closeFormModal,
}: TUseCourseMutationsParams): TUseCourseMutations => {
  const createMutation = useMutation<
    TCourse,
    TApiError,
    TCourseCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TCourseCreateMutationVariables) =>
      CourseService.createCourse(createData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Course created successfully');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create course');
    },
  });

  const updateMutation = useMutation<
    TCourse,
    TApiError,
    TCourseUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TCourseUpdateMutationVariables) =>
      CourseService.updateCourse(id, updateData),
    onSuccess: async () => {
      await refetch();
      closeFormModal();

      toast.success('Course updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update course');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TCourseDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ENTITY_KEYS.ID]: id,
    }: TCourseDeleteMutationVariables) => CourseService.deleteCourse(id),
    onSuccess: async () => {
      await refetch();

      toast.success('Course deleted successfully');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete course');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
