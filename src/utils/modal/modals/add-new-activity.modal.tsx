import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { FormEvent, JSX, useEffect, useMemo, useState } from 'react';
import { BaseModal, E_MODAL_MODE, TCommonModalProps } from '../base-modal';
import Box from '@mui/material/Box';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  E_COURSE_ACTIVITY_FORM,
} from '../../../api/course-activities/types';
import { startCase, values } from 'lodash';
import { TCourseActivityCreateData } from '../../../api/course-activities/course-activities.service';

export type TAddNewActivityModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.ADD_NEW_ACTIVITY>;

export type TAddNewActivityModalForm = Omit<
  TCourseActivityCreateData,
  E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE
>;

const AddNewActivityModal = ({
  onClose,
  onSuccess,
  mode,
  initialData,
}: TAddNewActivityModalProps) => {
  const [data, setData] = useState<TAddNewActivityModalForm>({
    [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: E_COURSE_ACTIVITY_FORM.LECTURE,
    [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: '',
  });

  useEffect(() => {
    if (initialData) {
      const {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: initialForm,
        [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: initialRequirements,
      } = initialData;
      setData((prev) => ({
        ...prev,
        ...(initialForm && {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: initialForm,
          [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: initialRequirements,
        }),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSaveDisabled = useMemo(() => {
    const {
      [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: form,
      [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: requirements,
    } = data;
    return !form;
  }, [data]);

  const handleActivityChange = (
    event: SelectChangeEvent<E_COURSE_ACTIVITY_FORM>,
  ) => {
    setData((prev) => ({
      ...prev,
      [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: event.target
        .value as E_COURSE_ACTIVITY_FORM,
    }));
  };

  const handleRequirementsChange = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: initialData.course,
        ...data,
      });
    }

    if (mode === E_MODAL_MODE.UPDATE) {
      const id = initialData[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];

      onSuccess(id, {
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: initialData.course,
        ...data,
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
        Save
      </Button>
    </Box>
  );

  return (
    <BaseModal
      show
      title={'Add new activity'}
      onClose={handleModalClose}
      onSubmit={handleSave}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }}>
        <Stack direction={'column'} gap={2}>
          <FormControl fullWidth>
            <InputLabel>Activity</InputLabel>
            <Select
              variant={'outlined'}
              fullWidth
              label={'Activity'}
              onChange={handleActivityChange}
              value={data[E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]}
            >
              {values(E_COURSE_ACTIVITY_FORM).map((form) => (
                <MenuItem key={form} value={form}>
                  {startCase(form)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={8}
            label={'Requirements'}
            name={E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS}
            onChange={handleRequirementsChange}
            value={data[E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]}
          />
        </Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default AddNewActivityModal;
