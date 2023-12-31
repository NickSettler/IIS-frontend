import { TUseCourseMutations } from './useCourseMutations';
import {
  TCourseCreateData,
  TCourseUpdateData,
} from '../../../api/course/course.service';
import { pick } from 'lodash';
import { E_COURSE_ENTITY_KEYS, TCourse } from '../../../api/course/types';

export type TUseCourseModalHandlersParams = Partial<
  Omit<TUseCourseMutations, 'deleteMutation'>
>;

export type TUseCourseModalHandlers = {
  handleCreateSuccess(createData: TCourseCreateData): void;
  handleUpdateSuccess(
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
    updateData: TCourseUpdateData,
  ): void;
};

export const useCourseModalHandlers = ({
  createMutation,
  updateMutation,
}: TUseCourseModalHandlersParams): TUseCourseModalHandlers => {
  const handleCreateSuccess = (createData: TCourseCreateData) => {
    if (!createMutation) return;

    const pureData = pick(createData, [
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);

    createMutation.mutate({
      data: {
        ...pureData,
        [E_COURSE_ENTITY_KEYS.ABBR]: createData[E_COURSE_ENTITY_KEYS.ABBR],
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
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
    updateData: TCourseUpdateData,
  ) => {
    if (!updateMutation) return;

    const pureData = pick(updateData, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);

    updateMutation.mutate({
      id,
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
