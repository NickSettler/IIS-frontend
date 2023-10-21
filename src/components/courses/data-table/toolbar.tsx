import { JSX } from 'react';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Button } from '@mui/material';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { Add, Delete } from '@mui/icons-material';
import { GridRowId } from '@mui/x-data-grid';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { TCreateCourseData } from '../../../api/courses/course.service';

export type TCourseDataTableToolbarProps = {
  rowSelection: Array<GridRowId>;
  handleCreateSuccess(data: TCreateCourseData): void;
  openCreateModal(meta: TDynModalMeta<E_MODALS.COURSE_FORM>): void;
  handleDeleteSelected(): void;
};

export const CourseDataTableToolbar = ({
  rowSelection,
  openCreateModal,
  handleCreateSuccess,
  handleDeleteSelected,
}: TCourseDataTableToolbarProps): JSX.Element => (
  <DataGridToolbar
    selection={rowSelection}
    prependButtons={[
      <Button
        key={E_MODALS.ADD_NEW_USER}
        size={'small'}
        startIcon={<Add />}
        onClick={() =>
          openCreateModal({
            mode: E_MODAL_MODE.CREATE,
            onSuccess: handleCreateSuccess,
          })
        }
      >
        Add new course
      </Button>,
    ]}
    endButtons={[
      <Button
        key={'delete-selected'}
        size={'small'}
        startIcon={<Delete />}
        onClick={handleDeleteSelected}
      >
        Delete selected
      </Button>,
    ]}
  />
);
