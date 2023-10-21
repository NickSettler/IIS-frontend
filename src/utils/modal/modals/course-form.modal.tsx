import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { E_USER_ENTITY_KEYS, TApiUser } from '../../../api/user/types';
import {
  FormEvent,
  JSX,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { every, filter, map, mapValues, omit, toString } from 'lodash';
import { BaseModal, E_MODAL_MODE, TCommonModalProps } from '../base-modal';
import Box from '@mui/material/Box';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { E_COURSE_ENTITY_KEYS } from '../../../api/courses/types';
import { TCreateCourseData } from '../../../api/courses/course.service';
import { useQuery } from '@tanstack/react-query';
import UserService from '../../../api/user/user.service';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { AutocompleteValue } from '@mui/base/useAutocomplete/useAutocomplete';

export type TCourseFormModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.COURSE_FORM>;

export type TCourseFormModalData = Omit<
  TCreateCourseData,
  E_COURSE_ENTITY_KEYS.CREDITS | E_COURSE_ENTITY_KEYS.TEACHERS
> & {
  [E_COURSE_ENTITY_KEYS.CREDITS]: string;
  [E_COURSE_ENTITY_KEYS.TEACHERS]: Array<TApiUser>;
};

const CourseFormModal = ({
  onClose,
  onSuccess,
  mode,
  initialData,
  ...rest
}: TCourseFormModalProps) => {
  const { data: usersData } = useQuery({
    queryKey: ['getUsers'],
    queryFn: UserService.getUsers.bind(UserService),
  });

  const [data, setData] = useState<TCourseFormModalData>({
    [E_COURSE_ENTITY_KEYS.ABBR]: '',
    [E_COURSE_ENTITY_KEYS.NAME]: '',
    [E_COURSE_ENTITY_KEYS.ANNOTATION]: '',
    [E_COURSE_ENTITY_KEYS.CREDITS]: '',
    [E_COURSE_ENTITY_KEYS.GUARANTOR]: '',
    [E_COURSE_ENTITY_KEYS.TEACHERS]: [],
  });

  useEffect(() => {
    if (initialData)
      setData((prev) => ({
        ...prev,
        ...mapValues(
          omit(initialData, [
            E_COURSE_ENTITY_KEYS.CREDITS,
            E_COURSE_ENTITY_KEYS.GUARANTOR,
            E_COURSE_ENTITY_KEYS.TEACHERS,
          ]),
          toString,
        ),
        ...(initialData[E_COURSE_ENTITY_KEYS.CREDITS] && {
          [E_COURSE_ENTITY_KEYS.CREDITS]: toString(
            initialData[E_COURSE_ENTITY_KEYS.CREDITS],
          ),
        }),
        ...(initialData[E_COURSE_ENTITY_KEYS.GUARANTOR] && {
          [E_COURSE_ENTITY_KEYS.GUARANTOR]:
            initialData[E_COURSE_ENTITY_KEYS.GUARANTOR][E_USER_ENTITY_KEYS.ID],
        }),
        ...(initialData[E_COURSE_ENTITY_KEYS.TEACHERS] && {
          [E_COURSE_ENTITY_KEYS.TEACHERS]:
            initialData[E_COURSE_ENTITY_KEYS.TEACHERS],
        }),
      }));
  }, [initialData]);

  const isSaveDisabled = useMemo(() => {
    const {
      [E_COURSE_ENTITY_KEYS.ABBR]: abbreviation,
      [E_COURSE_ENTITY_KEYS.NAME]: name,
      [E_COURSE_ENTITY_KEYS.CREDITS]: credits,
    } = data;

    return !abbreviation || !name || !credits;
  }, [data]);

  const handleFieldChange = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuarantorChange = (event: SelectChangeEvent) => {
    setData((prev) => ({
      ...prev,
      [E_COURSE_ENTITY_KEYS.GUARANTOR]: event.target.value,
    }));
  };

  const handleTeachersChange = (
    _: SyntheticEvent,
    newValue: AutocompleteValue<TApiUser, true, true, false>,
  ) => {
    setData((prev) => ({
      ...prev,
      [E_COURSE_ENTITY_KEYS.TEACHERS]: newValue,
    }));
  };

  const filterFunc = (options: Array<TApiUser>): Array<TApiUser> =>
    filter(options, (option) =>
      every(
        data[E_COURSE_ENTITY_KEYS.TEACHERS],
        (teacher) =>
          teacher[E_USER_ENTITY_KEYS.ID] !== option[E_USER_ENTITY_KEYS.ID],
      ),
    );

  const handleModalClose = (
    _: Record<string, never>,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick') return;

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    if (isSaveDisabled) return;

    if (mode === E_MODAL_MODE.CREATE) {
      onSuccess({
        ...data,
        [E_COURSE_ENTITY_KEYS.CREDITS]: parseInt(
          data[E_COURSE_ENTITY_KEYS.CREDITS],
        ),
        [E_COURSE_ENTITY_KEYS.TEACHERS]: map(
          data[E_COURSE_ENTITY_KEYS.TEACHERS],
          E_USER_ENTITY_KEYS.ID,
        ),
      });
    }

    if (mode === E_MODAL_MODE.UPDATE) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const abbr = rest.abbr;

      onSuccess(abbr, {
        ...data,
        [E_COURSE_ENTITY_KEYS.CREDITS]: parseInt(
          data[E_COURSE_ENTITY_KEYS.CREDITS],
        ),
        [E_COURSE_ENTITY_KEYS.TEACHERS]: map(
          data[E_COURSE_ENTITY_KEYS.TEACHERS],
          E_USER_ENTITY_KEYS.ID,
        ),
      });
    }
  };

  const footer = (): JSX.Element => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button type={'button'} color={'muted'} onClick={handleClose}>
        Cancel
      </Button>
      <Button
        type={'submit'}
        color={'primary'}
        disabled={isSaveDisabled}
        onClick={handleSave}
      >
        {mode === E_MODAL_MODE.CREATE ? 'Add' : 'Save'}
      </Button>
    </Box>
  );

  return (
    <BaseModal
      show
      title={mode === E_MODAL_MODE.CREATE ? 'Add new course' : 'Edit course'}
      onClose={handleModalClose}
      onSubmit={handleSave}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }} onChange={handleFieldChange}>
        <TextField
          fullWidth
          required
          label={'Name'}
          name={E_COURSE_ENTITY_KEYS.NAME}
          value={data[E_COURSE_ENTITY_KEYS.NAME]}
        />
        <Stack direction={'row'} gap={2}>
          <TextField
            fullWidth
            required
            label={'Abbreviation'}
            name={E_COURSE_ENTITY_KEYS.ABBR}
            value={data[E_COURSE_ENTITY_KEYS.ABBR]}
          />
          <TextField
            fullWidth
            required
            type={'number'}
            label={'Credits'}
            name={E_COURSE_ENTITY_KEYS.CREDITS}
            value={data[E_COURSE_ENTITY_KEYS.CREDITS] ?? ''}
          />
        </Stack>
        <TextField
          fullWidth
          multiline
          rows={4}
          label={'Annotation'}
          name={E_COURSE_ENTITY_KEYS.ANNOTATION}
          value={data[E_COURSE_ENTITY_KEYS.ANNOTATION]}
        />
        <FormControl fullWidth required>
          <InputLabel>Guarantor</InputLabel>
          <Select
            label={'Guarantor'}
            name={E_COURSE_ENTITY_KEYS.GUARANTOR}
            value={data[E_COURSE_ENTITY_KEYS.GUARANTOR]}
            onChange={handleGuarantorChange}
          >
            {usersData?.map((user) => (
              <MenuItem
                key={user[E_USER_ENTITY_KEYS.ID]}
                value={user[E_USER_ENTITY_KEYS.ID]}
              >
                {user[E_USER_ENTITY_KEYS.FIRST_NAME]}{' '}
                {user[E_USER_ENTITY_KEYS.LAST_NAME]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          renderInput={(params) => (
            <TextField {...params} label='Teachers' placeholder='Teacher' />
          )}
          value={data[E_COURSE_ENTITY_KEYS.TEACHERS]}
          onChange={handleTeachersChange}
          renderTags={(tags, getTagProps) =>
            tags.map((tag, index) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                size={'small'}
                color={'primary'}
                label={`${tag[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
                  tag[E_USER_ENTITY_KEYS.LAST_NAME]
                }`}
                {...getTagProps({ index })}
              />
            ))
          }
          disableCloseOnSelect
          filterOptions={filterFunc}
          options={usersData ?? []}
          getOptionLabel={(option) =>
            `${option[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
              option[E_USER_ENTITY_KEYS.LAST_NAME]
            }`
          }
        />
      </FormGroup>
    </BaseModal>
  );
};

export default CourseFormModal;
