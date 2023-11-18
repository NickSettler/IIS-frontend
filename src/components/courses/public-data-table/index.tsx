import { usePublicCourses } from '../../../utils/hooks/course/usePublicCourses';
import { E_COURSE_ENTITY_KEYS, TPublicCourse } from '../../../api/course/types';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { isEmpty } from 'lodash';

export const PublicCoursesDataTable = () => {
  const { data, isLoading, isError } = usePublicCourses();

  const gridColumns: Array<GridColDef<TPublicCourse>> = [
    {
      field: E_COURSE_ENTITY_KEYS.ABBR,
      headerName: 'Abbreviation',
      hideable: false,
    },
    {
      field: E_COURSE_ENTITY_KEYS.NAME,
      headerName: 'Name',
      flex: 1,
      hideable: false,
    },
    {
      field: E_COURSE_ENTITY_KEYS.ANNOTATION,
      headerName: 'Annotation',
      flex: 1,
      renderCell: ({
        value,
      }: GridRenderCellParams<
        TPublicCourse,
        TPublicCourse[E_COURSE_ENTITY_KEYS.ANNOTATION]
      >) => (isEmpty(value) ? <i>None</i> : value),
    },
  ];

  return (
    <DataGrid
      columns={gridColumns}
      rows={data ?? []}
      loading={isLoading}
      getRowId={(row) => row.abbr}
    />
  );
};
