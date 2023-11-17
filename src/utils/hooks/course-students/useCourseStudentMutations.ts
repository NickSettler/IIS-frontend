import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TApiError } from '../../../api/base/types';
import {
  E_COURSE_STUDENT_ENTITY_KEYS,
  TCourseStudent,
} from '../../../api/course/types';
import CourseService, {
  TCourseStudentCreateMutationVariables,
  TCourseStudentDeleteMutationVariables,
} from '../../../api/course/course.service';
import { toast } from 'react-hot-toast';

export type TUseCourseStudentMutationsParams = {
  refetch(): Promise<unknown>;
};

export type TUseCourseStudentMutations = {
  createMutation: UseMutationResult<
    TCourseStudent,
    TApiError,
    TCourseStudentCreateMutationVariables
  >;
  deleteMutation: UseMutationResult<
    void,
    TApiError,
    TCourseStudentDeleteMutationVariables
  >;
};

export const useCourseStudentMutations = ({
  refetch,
}: TUseCourseStudentMutationsParams): TUseCourseStudentMutations => {
  const createMutation = useMutation<
    TCourseStudent,
    TApiError,
    TCourseStudentCreateMutationVariables
  >({
    mutationFn: async ({
      data: createData,
    }: TCourseStudentCreateMutationVariables) =>
      CourseService.createCourseStudent(createData),
    onSuccess: async () => {
      await refetch();

      toast.success('Successfully enrolled student');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to enroll student');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TCourseStudentDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_STUDENT_ENTITY_KEYS.STUDENT]: studentID,
      [E_COURSE_STUDENT_ENTITY_KEYS.COURSE]: courseID,
    }: TCourseStudentDeleteMutationVariables) =>
      CourseService.deleteCourseStudent(courseID, studentID),
    onSuccess: async () => {
      await refetch();

      toast.success('Successfully unenrolled student');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to unenroll student');
    },
  });

  return {
    createMutation,
    deleteMutation,
  };
};
