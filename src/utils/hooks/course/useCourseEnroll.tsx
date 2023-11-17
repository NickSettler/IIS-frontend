import { useLocalUserInfo } from '../local-storage/useLocalUserInfo';
import { useCallback, useMemo } from 'react';
import { E_ROLE } from '../../../api/user/types';
import { find } from 'lodash';
import {
  E_COURSE_STUDENT_ENTITY_KEYS,
  TCourse,
  TCourseStudent,
} from '../../../api/course/types';
import { GridActionsCellItem, GridActionsColDef } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import { Login, Logout } from '@mui/icons-material';
import { useCourseStudents } from '../course-students/useCourseStudents';
import { useCourseStudentMutations } from '../course-students/useCourseStudentMutations';

export type TUseCourseEnroll = {
  customActions: GridActionsColDef<TCourse>;
};

export const useCourseEnroll = (): TUseCourseEnroll => {
  const { data, refetch } = useCourseStudents();

  const { createMutation, deleteMutation } = useCourseStudentMutations({
    refetch,
  });

  const { id, roles } = useLocalUserInfo();

  const isStudent = useMemo(() => roles.includes(E_ROLE.STUDENT), [roles]);

  const isVisibleMenuAction = useCallback(
    (courseID: string, action: 'enroll' | 'unroll') => {
      if (!isStudent || !data) return false;

      const student = find(data, {
        [E_COURSE_STUDENT_ENTITY_KEYS.STUDENT_ID]: id,
        [E_COURSE_STUDENT_ENTITY_KEYS.COURSE_ID]: courseID,
      });

      if (action === 'enroll') return !student;

      return !!student;
    },
    [data, id, isStudent],
  );

  const handleEnrollClick = useCallback(
    (courseID: TCourseStudent[E_COURSE_STUDENT_ENTITY_KEYS.COURSE_ID]) =>
      () => {
        createMutation.mutate({
          data: {
            course: courseID,
            student: id,
          },
        });
      },
    [createMutation, id],
  );

  const handleUnrollClick = useCallback(
    (courseID: TCourseStudent[E_COURSE_STUDENT_ENTITY_KEYS.COURSE_ID]) =>
      () => {
        deleteMutation.mutate({
          course: courseID,
          student: id,
        });
      },
    [deleteMutation, id],
  );

  const customActions: GridActionsColDef<TCourse> = {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    getActions: (params) => [
      ...(isVisibleMenuAction(`${params.id}`, 'enroll')
        ? [
            <Tooltip title={'Enroll'} key={'enroll'}>
              <GridActionsCellItem
                label={'Enroll'}
                icon={<Login />}
                onClick={handleEnrollClick(`${params.id}`)}
              />
            </Tooltip>,
          ]
        : []),
      ...(isVisibleMenuAction(`${params.id}`, 'unroll')
        ? [
            <Tooltip title={'Unroll'} key={'unroll'}>
              <GridActionsCellItem
                label={'Unroll'}
                icon={<Logout />}
                onClick={handleUnrollClick(`${params.id}`)}
              />
            </Tooltip>,
          ]
        : []),
    ],
  };

  return {
    customActions,
  };
};
