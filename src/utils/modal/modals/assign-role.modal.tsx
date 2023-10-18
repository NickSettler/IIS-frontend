import { useState } from 'react';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { filter, values } from 'lodash';
import { useUser } from '../../hooks/useUser';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';

export type TAssignRoleModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.ASSIGN_ROLE>;

export const AssignRoleModal = ({
  userID,
  onClose,
  onSuccess,
}: TAssignRoleModalProps) => {
  const query = useUser(userID);

  const [value, setValue] = useState<E_ROLE>();

  const handleChange = (event: SelectChangeEvent<E_ROLE>) => {
    setValue(event.target.value as E_ROLE);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSuccessClose = () => {
    if (!userID || !value) return;

    onSuccess(userID, value);
  };

  if (!query?.data) return null;

  const { data, isLoading, error } = query;

  const possibleRoles = filter(
    values(E_ROLE),
    (role) =>
      !data[E_USER_ENTITY_KEYS.ROLES].some(
        (userRole) => userRole[E_ROLE_ENTITY_KEYS.NAME] === role,
      ),
  );

  const footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button color={'muted'} onClick={handleClose}>
        Cancel
      </Button>
      <Button onClick={handleSuccessClose}>Assign</Button>
    </Box>
  );

  return (
    <BaseModal
      show
      title={'Assign role'}
      onClose={handleClose}
      footer={footer()}
    >
      <Box sx={{ pt: 1 }}>
        {isLoading && <CircularProgress />}

        {error && <Typography>Error: {error.message}</Typography>}

        {possibleRoles && (
          <FormControl fullWidth>
            <InputLabel id='roles-label'>Roles</InputLabel>
            <Select
              labelId={'roles-label'}
              label={'Roles'}
              value={value}
              onChange={handleChange}
            >
              {possibleRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </BaseModal>
  );
};

export default AssignRoleModal;
