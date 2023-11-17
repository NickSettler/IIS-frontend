import {
  TCourseActivityCreateData,
  TCourseActivityUpdateData,
} from '../../../api/course-activities/course-activities.service';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../../api/course-activities/types';
import { omit } from 'lodash';
import { TUseCourseActivityMutations } from './useCourseActivityMutations';

export type TUseCourseActivityModalHandlersParams = Partial<
  Omit<TUseCourseActivityMutations, 'deleteMutation'>
>;

export type TUseCourseActivityModalHandlers = {
  handleCreateSuccess(createData: TCourseActivityCreateData): void;
  handleUpdateSuccess(
    id: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
    updateData: TCourseActivityUpdateData,
  ): void;
};

export const useCourseActivityModalHandlers = ({
  createMutation,
  updateMutation,
}: TUseCourseActivityModalHandlersParams): TUseCourseActivityModalHandlers => {
  const handleCreateSuccess = (createData: TCourseActivityCreateData) => {
    if (!createMutation) return;

    createMutation.mutate({
      data: createData,
    });
  };

  const handleUpdateSuccess = (
    id: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
    updateData: TCourseActivityUpdateData,
  ) => {
    if (!updateMutation) return;

    updateMutation.mutate({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      data: omit(
        updateData,
        E_COURSE_ACTIVITY_ENTITY_KEYS.ID,
        E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE,
      ),
    });
  };

  return {
    handleCreateSuccess,
    handleUpdateSuccess,
  };
};
