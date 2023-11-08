import { JSX } from 'react';
import { useTeacherRequirements } from '../../utils/hooks/teacher-requirements/useTeacherRequirements';
import { GridColDef } from '@mui/x-data-grid';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../api/teacher-requirements/types';
import { useTeacherRequirementMutations } from '../../utils/hooks/teacher-requirements/useTeacherRequirementMutations';
import { useTeacherRequirementModalHandlers } from '../../utils/hooks/teacher-requirements/useTeacherRequirementModalHandlers';
import { useTeacherRequirementPermissions } from '../../utils/hooks/teacher-requirements/useTeacherRequirementPermissions';
import { E_MODALS } from '../../store/modals';
import { GenericDataGrid } from '../data-grid/generic-datagrid';

export const ProfileTeacherRequirements = (): JSX.Element => {
  const gridColumns: Array<GridColDef<TTeacherRequirement>> = [
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME,
      headerName: 'Start time',
      type: 'dateTime',
      width: 200,
    },
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME,
      headerName: 'End time',
      type: 'dateTime',
      width: 200,
    },
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE,
      headerName: 'Mode',
      flex: 1,
    },
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.TEACHER_REQUIREMENT_FORM}
      primaryKey={E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID}
      columns={gridColumns}
      caption={'Requirement'}
      actions={['duplicate', 'edit', 'delete']}
      queryFunction={useTeacherRequirements}
      permissionsFunction={useTeacherRequirementPermissions}
      mutationsFunction={useTeacherRequirementMutations}
      modalHandlersFunction={useTeacherRequirementModalHandlers}
    />
  );
};
