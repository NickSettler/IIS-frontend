import { TUseCourseMutations } from './useCourseMutations';
import {
  TCreateCourseData,
  TUpdateCourseData,
} from '../../api/courses/course.service';
import { pick } from 'lodash';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/courses/types';

export type TUseCourseModalHandlersParams = Partial<
  Omit<TUseCourseMutations, 'deleteMutation'>
>;

export type TUseCourseModalHandlers = {
  handleCreateSuccess(createData: TCreateCourseData): void;
  handleUpdateSuccess(
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
    updateData: TUpdateCourseData,
  ): void;
};

export const useCourseModalHandlers = ({
  createMutation,
  updateMutation,
}: TUseCourseModalHandlersParams): TUseCourseModalHandlers => {
  const handleCreateSuccess = (createData: TCreateCourseData) => {
    if (!createMutation) return;

    const pureData = pick(createData, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);

    createMutation.mutate({
      data: {
        ...pureData,
        ...(createData[E_COURSE_ENTITY_KEYS.ANNOTATION] && {
          [E_COURSE_ENTITY_KEYS.ANNOTATION]:
            createData[E_COURSE_ENTITY_KEYS.ANNOTATION],
        }),
        ...(createData[E_COURSE_ENTITY_KEYS.TEACHERS] && {
          [E_COURSE_ENTITY_KEYS.TEACHERS]:
            createData[E_COURSE_ENTITY_KEYS.TEACHERS],
        }),
      },
    });
  };

  const handleUpdateSuccess = (
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
    updateData: TUpdateCourseData,
  ) => {
    if (!updateMutation) return;

    const pureData = pick(updateData, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);

    updateMutation.mutate({
      abbr,
      data: {
        ...pureData,
        ...(updateData[E_COURSE_ENTITY_KEYS.ANNOTATION] && {
          [E_COURSE_ENTITY_KEYS.ANNOTATION]:
            updateData[E_COURSE_ENTITY_KEYS.ANNOTATION],
        }),
        ...(updateData[E_COURSE_ENTITY_KEYS.TEACHERS] && {
          [E_COURSE_ENTITY_KEYS.TEACHERS]:
            updateData[E_COURSE_ENTITY_KEYS.TEACHERS],
        }),
      },
    });
  };

  return {
    handleCreateSuccess,
    handleUpdateSuccess,
  };
};
