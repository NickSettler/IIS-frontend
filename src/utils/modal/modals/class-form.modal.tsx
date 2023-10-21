import { Button, FormGroup, TextField } from '@mui/material';
import { FormEvent, JSX, useEffect, useMemo, useState } from 'react';
import { mapValues, omit, toString } from 'lodash';
import { BaseModal, E_MODAL_MODE, TCommonModalProps } from '../base-modal';
import Box from '@mui/material/Box';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { TClassCreateData } from '../../../api/class/class.service';
import { E_CLASS_ENTITY_KEYS } from '../../../api/class/types';

export type TClassFormModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.CLASS_FORM>;

export type TClassFormModalData = Omit<
  TClassCreateData,
  E_CLASS_ENTITY_KEYS.CAPACITY
> & {
  [E_CLASS_ENTITY_KEYS.CAPACITY]: string;
};

const ClassFormModal = ({
  onClose,
  onSuccess,
  mode,
  initialData,
  ...rest
}: TClassFormModalProps) => {
  const [data, setData] = useState<TClassFormModalData>({
    [E_CLASS_ENTITY_KEYS.ABBR]: '',
    [E_CLASS_ENTITY_KEYS.CAPACITY]: '',
  });

  useEffect(() => {
    if (initialData)
      setData((prev) => ({
        ...prev,
        ...mapValues(
          omit(initialData, [E_CLASS_ENTITY_KEYS.CAPACITY]),
          toString,
        ),
        ...(initialData[E_CLASS_ENTITY_KEYS.CAPACITY] && {
          [E_CLASS_ENTITY_KEYS.CAPACITY]: toString(
            initialData[E_CLASS_ENTITY_KEYS.CAPACITY],
          ),
        }),
      }));
  }, [initialData]);

  const isSaveDisabled = useMemo(() => {
    const {
      [E_CLASS_ENTITY_KEYS.ABBR]: abbreviation,
      [E_CLASS_ENTITY_KEYS.CAPACITY]: capacity,
    } = data;

    return !abbreviation || !capacity;
  }, [data]);

  const handleFieldChange = (event: FormEvent) => {
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
        ...data,
        [E_CLASS_ENTITY_KEYS.CAPACITY]: parseInt(
          data[E_CLASS_ENTITY_KEYS.CAPACITY],
        ),
      });
    }

    if (mode === E_MODAL_MODE.UPDATE) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const abbr = rest.abbr;

      onSuccess(abbr, {
        ...data,
        [E_CLASS_ENTITY_KEYS.CAPACITY]: parseInt(
          data[E_CLASS_ENTITY_KEYS.CAPACITY],
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
      title={mode === E_MODAL_MODE.CREATE ? 'Add new class' : 'Edit class'}
      onClose={handleModalClose}
      onSubmit={handleSave}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }} onChange={handleFieldChange}>
        <TextField
          fullWidth
          required
          label={'Abbreviation'}
          name={E_CLASS_ENTITY_KEYS.ABBR}
          value={data[E_CLASS_ENTITY_KEYS.ABBR]}
        />
        <TextField
          fullWidth
          required
          label={'Capacity'}
          name={E_CLASS_ENTITY_KEYS.CAPACITY}
          value={data[E_CLASS_ENTITY_KEYS.CAPACITY]}
        />
      </FormGroup>
    </BaseModal>
  );
};

export default ClassFormModal;
