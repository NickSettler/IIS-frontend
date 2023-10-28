import {
  TClassCreateData,
  TClassUpdateData,
} from '../../../api/class/class.service';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../../api/class/types';
import { TUseClassMutations } from './useClassMutations';

export type TUseClassModalHandlersParams = Partial<
  Omit<TUseClassMutations, 'deleteMutation'>
>;

export type TUseClassModalHandlers = {
  handleCreateSuccess(createData: TClassCreateData): void;
  handleUpdateSuccess(
    abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR],
    updateData: TClassUpdateData,
  ): void;
};

export const useClassModalHandlers = ({
  createMutation,
  updateMutation,
}: TUseClassModalHandlersParams): TUseClassModalHandlers => {
  const handleCreateSuccess = (createData: TClassCreateData) => {
    if (!createMutation) return;

    createMutation.mutate({
      data: createData,
    });
  };

  const handleUpdateSuccess = (
    abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR],
    updateData: TClassUpdateData,
  ) => {
    if (!updateMutation) return;

    updateMutation.mutate({
      abbr,
      data: updateData,
    });
  };

  return {
    handleCreateSuccess,
    handleUpdateSuccess,
  };
};
