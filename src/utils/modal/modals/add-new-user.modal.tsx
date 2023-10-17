import {
  Autocomplete,
  AutocompleteValue,
  Button,
  Chip,
  FormGroup,
  Stack,
  TextField,
} from '@mui/material';
import { E_ROLE, E_USER_ENTITY_KEYS, TUser } from '../../../api/user/types';
import { FormEvent, JSX, SyntheticEvent, useMemo, useState } from 'react';
import { map, startCase, values } from 'lodash';
import { BaseModal, TCommonModalProps } from '../base-modal';
import Box from '@mui/material/Box';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';

export type TAddNewUserModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.ADD_NEW_USER>;

const AddNewUserModal = ({ onClose, onSuccess }: TAddNewUserModalProps) => {
  const [data, setData] = useState<Omit<TUser, E_USER_ENTITY_KEYS.ID>>({
    [E_USER_ENTITY_KEYS.USERNAME]: '',
    [E_USER_ENTITY_KEYS.PASSWORD]: '',
    [E_USER_ENTITY_KEYS.FIRST_NAME]: '',
    [E_USER_ENTITY_KEYS.LAST_NAME]: '',
  });

  const [roles, setRoles] = useState<Array<string>>([]);

  const isSaveDisabled = useMemo(() => {
    const {
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.PASSWORD]: password,
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstName,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastName,
    } = data;

    return !username || !password || !firstName || !lastName;
  }, [data]);

  const handleFieldChange = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRolesChange = (
    _: SyntheticEvent,
    value: AutocompleteValue<string, true, true, false>,
  ) => {
    setRoles(value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (isSaveDisabled) return;

    onSuccess(data);
  };

  const footer = (): JSX.Element => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button color={'muted'} onClick={handleClose}>
        Cancel
      </Button>
      <Button color={'primary'} disabled={isSaveDisabled} onClick={handleSave}>
        Save
      </Button>
    </Box>
  );

  return (
    <BaseModal
      show={true}
      title={'Add new user'}
      onClose={handleClose}
      footer={footer()}
    >
      <FormGroup sx={{ pt: 1, gap: 2 }} onChange={handleFieldChange}>
        <Stack direction={'row'} gap={2}>
          <TextField
            fullWidth={true}
            label={'Username'}
            name={E_USER_ENTITY_KEYS.USERNAME}
            value={data[E_USER_ENTITY_KEYS.USERNAME]}
            autoComplete={'username'}
          />
          <TextField
            fullWidth={true}
            type={'password'}
            label={'Password'}
            name={E_USER_ENTITY_KEYS.PASSWORD}
            value={data[E_USER_ENTITY_KEYS.PASSWORD]}
            autoComplete={'new-password'}
          />
        </Stack>
        <Stack direction={'row'} gap={2}>
          <TextField
            fullWidth={true}
            label={'First name'}
            name={E_USER_ENTITY_KEYS.FIRST_NAME}
            value={data[E_USER_ENTITY_KEYS.FIRST_NAME]}
            autoComplete={'given-name'}
          />
          <TextField
            fullWidth={true}
            label={'Last name'}
            name={E_USER_ENTITY_KEYS.LAST_NAME}
            value={data[E_USER_ENTITY_KEYS.LAST_NAME]}
            autoComplete={'family-name'}
          />
        </Stack>
        <Autocomplete
          fullWidth={true}
          multiple={true}
          value={roles}
          renderInput={(params) => (
            <TextField {...params} label={'Roles'}></TextField>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                label={option}
                color={'primary'}
                {...getTagProps({ index })}
              />
            ))
          }
          onChange={handleRolesChange}
          options={map(values(E_ROLE), startCase)}
        />
      </FormGroup>
    </BaseModal>
  );
};

export default AddNewUserModal;
