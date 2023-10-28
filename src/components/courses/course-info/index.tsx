import React, { JSX, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { E_COURSE_ENTITY_KEYS } from '../../../api/course/types';
import { isUndefined } from 'lodash';
import { useCourse } from '../../../utils/hooks/useCourse';
import {
  IconButton,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { ArrowBack, Delete, Edit } from '@mui/icons-material';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useCourseMutations } from '../../../utils/hooks/useCourseMutations';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { useCourseModalHandlers } from '../../../utils/hooks/useCourseModalHandlers';
import { toast } from 'react-hot-toast';
import { useCoursePermissions } from '../../../utils/hooks/useCoursePermissions';
import { CourseActivityTable } from '../../course-activity/data-table';

export const CourseInfo = (): JSX.Element => {
  const { abbr } = useParams<'abbr'>();
  const navigate = useNavigate();

  if (isUndefined(abbr)) navigate('/courses');

  const { onOpen: openCourseFormModal, onClose: closeCourseFormModal } =
    useModal(E_MODALS.COURSE_FORM);

  const { data, isLoading, error, refetch } = useCourse(abbr);

  const { canUpdateCourse, canDeleteCourse } = useCoursePermissions(
    data ?? undefined,
  );

  const { updateMutation, deleteMutation } = useCourseMutations({
    refetch,
    closeCourseFormModal,
  });

  const { handleUpdateSuccess } = useCourseModalHandlers({
    updateMutation,
  });

  const handleEditClick = () => {
    if (!data) return;

    openCourseFormModal({
      abbr: data[E_COURSE_ENTITY_KEYS.ABBR],
      mode: E_MODAL_MODE.UPDATE,
      initialData: data,
      onSuccess: handleUpdateSuccess,
    });
  };

  const handleDeleteClick = () => {
    if (!data || !abbr) return;

    deleteMutation.mutate(
      {
        [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      },
      {
        onSuccess: async () => {
          navigate(-1);

          toast.success('Course deleted successfully');
        },
        onError: async () => {
          await refetch();

          toast.error('Failed to delete course');
        },
      },
    );
  };

  const title = useMemo(
    () =>
      data
        ? `${data[E_COURSE_ENTITY_KEYS.ABBR]} - ${
            data[E_COURSE_ENTITY_KEYS.NAME]
          }`
        : '',
    [data],
  );

  const guarantor = useMemo(() => {
    if (!data) return '';

    const g = data[E_COURSE_ENTITY_KEYS.GUARANTOR];

    return `${g[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
      g[E_USER_ENTITY_KEYS.LAST_NAME]
    } (${g[E_USER_ENTITY_KEYS.USERNAME]})`;
  }, [data]);

  const credits = useMemo(
    () => (data ? data[E_COURSE_ENTITY_KEYS.CREDITS] : ''),
    [data],
  );

  const annotation = useMemo(
    () => (data ? data[E_COURSE_ENTITY_KEYS.ANNOTATION] : ''),
    [data],
  );

  const teachers = useMemo(
    () => (data ? data[E_COURSE_ENTITY_KEYS.TEACHERS] : []),
    [data],
  );

  if (error && error.statusCode === 404) return <Navigate to={'/courses'} />;

  return (
    <Stack gap={4}>
      <Stack direction='row' justifyContent='space-between' gap={4}>
        <Stack direction='row' gap={2} alignItems={'center'}>
          <Tooltip title='Back'>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          {isLoading ? (
            <Skeleton
              variant={'rectangular'}
              animation={'wave'}
              sx={{ maxWidth: 'initial' }}
            >
              <Typography variant='h4' flexGrow={1}></Typography>
            </Skeleton>
          ) : (
            <Typography variant='h4' flexGrow={1}>
              {title}
            </Typography>
          )}
        </Stack>
        {(canUpdateCourse || canDeleteCourse) && (
          <Stack direction='row' gap={1} alignItems={'center'}>
            {canUpdateCourse && (
              <Button
                size={'small'}
                variant={'text'}
                startIcon={<Edit />}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
            {canDeleteCourse && (
              <Button
                size={'small'}
                variant={'text'}
                color={'error'}
                startIcon={<Delete />}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            )}
          </Stack>
        )}
      </Stack>
      <Container maxWidth={false} disableGutters>
        <Grid container columnSpacing={4} rowSpacing={4} direction={'row'}>
          <Grid container item xs={6} rowSpacing={1}>
            <Grid item xs={12}>
              <Typography variant={'h6'}>Guarantor</Typography>
              {isLoading ? (
                <Skeleton
                  variant={'rectangular'}
                  animation={'wave'}
                  sx={{ maxWidth: 'initial' }}
                >
                  <Typography variant='body1' flexGrow={1}>
                    Admin
                  </Typography>
                </Skeleton>
              ) : (
                <Typography variant='body1' flexGrow={1}>
                  {guarantor}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'h6'}>Credits</Typography>
              {isLoading ? (
                <Skeleton
                  variant={'rectangular'}
                  animation={'wave'}
                  sx={{ maxWidth: 'initial' }}
                >
                  <Typography variant='body1' flexGrow={1}>
                    0
                  </Typography>
                </Skeleton>
              ) : (
                <Typography variant='body1' flexGrow={1}>
                  {credits}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'h6'}>Annotation</Typography>
              {isLoading ? (
                <Skeleton
                  variant={'rectangular'}
                  animation={'wave'}
                  sx={{ maxWidth: 'initial' }}
                >
                  <Typography variant='body1' flexGrow={1}>
                    None
                  </Typography>
                </Skeleton>
              ) : (
                <Typography variant='body1' flexGrow={1}>
                  {annotation}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container item direction={'column'} xs={6} rowGap={1}>
            <Typography variant={'h6'}>Teachers</Typography>
            <Paper variant={'outlined'}>
              <List dense disablePadding>
                {teachers.map((teacher) => (
                  <ListItem key={teacher[E_USER_ENTITY_KEYS.ID]}>
                    <ListItemText
                      primary={`${teacher[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
                        teacher[E_USER_ENTITY_KEYS.LAST_NAME]
                      }`}
                      secondary={teacher[E_USER_ENTITY_KEYS.USERNAME]}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid container item direction={'column'} xs={6} rowGap={1}>
            <CourseActivityTable />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};
