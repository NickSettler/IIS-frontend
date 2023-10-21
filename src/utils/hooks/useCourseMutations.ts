import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/course/types';
import { TApiError } from '../../api/base/types';
import CourseService, {
  TCourseCreateMutationVariables,
  TCourseDeleteMutationVariables,
  TCourseUpdateMutationVariables,
} from '../../api/course/course.service';
import { toast } from 'react-hot-toast';

export type TUseCourseMutationsParams = {
  refetch(): Promise<unknown>;
  closeCourseFormModal(): void;
};

export type TUseCourseMutations = {
  createMutation: UseMutationResult<
    TPureCourse,
    TApiError,
    TCourseCreateMutationVariables
  >;
  updateMutation: UseMutationResult<
    TPureCourse,
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
  closeCourseFormModal,
}: TUseCourseMutationsParams): TUseCourseMutations => {
  const createMutation = useMutation<
    TPureCourse,
    TApiError,
    TCourseCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TCourseCreateMutationVariables) =>
      CourseService.createCourse(createData),
    onSuccess: async () => {
      await refetch();
      closeCourseFormModal();

      toast.success('Course created successfully');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create course');
    },
  });

  const updateMutation = useMutation<
    TPureCourse,
    TApiError,
    TCourseUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      data: updateData,
    }: TCourseUpdateMutationVariables) =>
      CourseService.updateCourse(abbr, updateData),
    onSuccess: async () => {
      await refetch();
      closeCourseFormModal();

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
      [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
    }: TCourseDeleteMutationVariables) => CourseService.deleteCourse(abbr),
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
