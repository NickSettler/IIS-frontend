import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../../api/teacher-requirements/types';
import {
  TTeacherRequirementCreateData,
  TTeacherRequirementUpdateData,
} from '../../../api/teacher-requirements/teacher-requirements.service';
import { TUseTeacherReqMutations } from './useTeacherRequirementMutations';

export type TUseTeacherReqModalHandlersParams = Partial<
  Omit<TUseTeacherReqMutations, 'deleteMutation'>
>;

export type TUseTeacherReqModalHandlers = {
  handleCreateSuccess(createData: TTeacherRequirementCreateData): void;
  handleUpdateSuccess(
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
    updateData: TTeacherRequirementUpdateData,
  ): void;
};

export const useTeacherRequirementModalHandlers = ({
  createMutation,
  updateMutation,
}: TUseTeacherReqModalHandlersParams): TUseTeacherReqModalHandlers => {
  const handleCreateSuccess = (createData: TTeacherRequirementCreateData) => {
    if (!createMutation) return;

    createMutation.mutate({
      data: createData,
    });
  };

  const handleUpdateSuccess = (
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
    updateData: TTeacherRequirementUpdateData,
  ) => {
    if (!updateMutation) return;

    updateMutation.mutate({
      id,
      data: updateData,
    });
  };

  return {
    handleCreateSuccess,
    handleUpdateSuccess,
  };
};
