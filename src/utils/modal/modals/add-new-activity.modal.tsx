import { Button, FormGroup, Stack, TextField } from '@mui/material';
import { FormEvent, JSX, useMemo, useState } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import Box from '@mui/material/Box';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../../api/course-activities/types';

export type TAddNewActivityModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.ADD_NEW_ACTIVITY>;

const AddNewActivityModal = ({
  onClose,
  onSuccess,
  ...rest
}: TAddNewActivityModalProps) => {
  const [data, setData] = useState<
    Omit<TCourseActivity, E_COURSE_ACTIVITY_ENTITY_KEYS.ID>
  >({
    [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: '',
    [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: rest.course,
  });

  const isSaveDisabled = useMemo(() => {
    const { [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: form } = data;

    return !form;
  }, [data]);

  const handleFieldChange = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalClose = (
    event: Record<string, never>,
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
    onSuccess({
      ...data,
    });
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
      <FormGroup sx={{ pt: 1, gap: 2 }} onChange={handleFieldChange}>
        <Stack direction={'row'} gap={2}>
          <TextField
            fullWidth
            label={'Activity'}
            name={E_COURSE_ACTIVITY_ENTITY_KEYS.FORM}
            value={data[E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]}
            autoComplete={'lecture'}
          />
        </Stack>
      </FormGroup>
    </BaseModal>
  );
};

export default AddNewActivityModal;
