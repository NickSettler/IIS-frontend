import {
  Box,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { FormEvent, JSX, useEffect, useMemo, useState } from 'react';
import { BaseModal, E_MODAL_MODE, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { TTeacherRequirementCreateData } from '../../../api/teacher-requirements/teacher-requirements.service';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  E_TEACHER_REQUIREMENT_MODE,
} from '../../../api/teacher-requirements/types';
import { E_USER_ENTITY_KEYS, TApiUser } from '../../../api/user/types';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { omit, startCase, values } from 'lodash';
import { useMe } from '../../hooks/user/useMe';

export type TTeacherRequirementModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.TEACHER_REQUIREMENT_FORM>;

export type TTeacherRequirementModalData = Omit<
  TTeacherRequirementCreateData,
  | E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME
  | E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME
  | E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER
> & {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: TApiUser | null;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: Date | null;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: Date | null;
};

const ClassFormModal = ({
  onClose,
  onSuccess,
  mode,
  initialData,
}: TTeacherRequirementModalProps) => {
  const { data: meData } = useMe();

  const [data, setData] = useState<TTeacherRequirementModalData>({
    [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: new Date(),
    [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: new Date(),
    [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]:
      E_TEACHER_REQUIREMENT_MODE.EXCLUDE,
    [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: null,
  });

  useEffect(() => {
    if (initialData)
      setData((prev) => ({
        ...prev,
        ...omit(initialData, [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]),
      }));
  }, [initialData]);

  useEffect(() => {
    if (meData && !data[E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER])
      setData((prev) => ({
        ...prev,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: meData,
      }));
  }, [data, meData]);

  const isSaveDisabled = useMemo(() => {
    const {
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: startTime,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: endTime,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]: formMode,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: teacher,
    } = data;

    const isSet = startTime && endTime && formMode && teacher;

    if (!isSet) return true;

    const isDateValid = startTime < endTime;

    return !isDateValid;
  }, [data]);

  const handleFieldChange = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange =
    (key: E_TEACHER_REQUIREMENT_ENTITY_KEYS) => (day: Dayjs | null) => {
      setData((prev) => ({
        ...prev,
        [key]: day?.toDate() ?? null,
      }));
    };

  const handleModeChange = (
    event: SelectChangeEvent<E_TEACHER_REQUIREMENT_MODE>,
  ) => {
    const value: E_TEACHER_REQUIREMENT_MODE = event.target
      .value as E_TEACHER_REQUIREMENT_MODE;

    setData((prev) => ({
      ...prev,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]: value,
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

    const {
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: startTime,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: endTime,
      [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: teacher,
    } = data;

    if (isSaveDisabled || !teacher || !startTime || !endTime) return;

    if (mode === E_MODAL_MODE.CREATE) {
      onSuccess({
        ...data,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: startTime,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: endTime,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]:
          teacher[E_USER_ENTITY_KEYS.ID],
      });
    }

    if (mode === E_MODAL_MODE.UPDATE) {
      const id = initialData[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID];

      onSuccess(id, {
        ...data,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: startTime,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: endTime,
        [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]:
          teacher[E_USER_ENTITY_KEYS.ID],
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
      title={mode === E_MODAL_MODE.CREATE ? 'Add new class' : 'Edit class'}
      onClose={handleModalClose}
      onSubmit={handleSave}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }} onChange={handleFieldChange}>
        <DateTimePicker
          label={'Start time'}
          value={dayjs(data[E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME])}
          onChange={handleDateChange(
            E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME,
          )}
          renderInput={(props) => <TextField {...props} />}
        />
        <DateTimePicker
          label={'End time'}
          value={dayjs(data[E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME])}
          onChange={handleDateChange(
            E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME,
          )}
          renderInput={(props) => <TextField {...props} />}
        />
        <FormControl fullWidth required>
          <InputLabel>Mode</InputLabel>
          <Select
            label={'Mode'}
            name={E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE}
            value={data[E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]}
            onChange={handleModeChange}
          >
            {values(E_TEACHER_REQUIREMENT_MODE).map((formMode) => (
              <MenuItem key={formMode} value={formMode}>
                {startCase(formMode)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormGroup>
    </BaseModal>
  );
};

export default ClassFormModal;
