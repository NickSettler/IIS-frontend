import { JSX } from 'react';
import { E_MODALS } from '../../../store/modals';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
} from '@mui/x-data-grid';
import { useClassPermissions } from '../../../utils/hooks/class/useClassPermissions';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../../api/class/types';
import { useClassMutations } from '../../../utils/hooks/class/useClassMutations';
import { useClassModalHandlers } from '../../../utils/hooks/class/useClassModalHandlers';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';
import { Event, OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { useClasses } from '../../../utils/hooks/class/useClasses';

export const ClassesDataTable = (): JSX.Element => {
  const navigate = useNavigate();

  const customActions: GridActionsColDef<TClass> = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    getActions: (params) => [
      <Tooltip title={'Open schedule'} key={'open-schedule'}>
        <GridActionsCellItem
          label={'Open schedule'}
          icon={<Event />}
          onClick={() => navigate(`/schedule/class/${params.id}`)}
        />
      </Tooltip>,
    ],
  };

  const gridColumns: Array<GridColDef<TClass>> = [
    {
      field: E_CLASS_ENTITY_KEYS.ID,
      headerName: 'ID',
      hideable: true,
    },
    {
      field: E_CLASS_ENTITY_KEYS.ABBR,
      headerName: 'Abbreviation',
      hideable: false,
    },
    {
      field: E_CLASS_ENTITY_KEYS.CAPACITY,
      headerName: 'Capacity',
      type: 'number',
      flex: 1,
      hideable: false,
    },
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.CLASS_FORM}
      primaryKey={E_CLASS_ENTITY_KEYS.ID}
      columns={gridColumns}
      caption={'Class'}
      actions={['duplicate', 'edit', 'delete']}
      customActions={customActions}
      queryFunction={useClasses}
      permissionsFunction={useClassPermissions}
      mutationsFunction={useClassMutations}
      modalHandlersFunction={useClassModalHandlers}
    />
  );
};
