import { useEffect, useState } from 'react';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TUserWithRoles,
} from '../../../api/user/types';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { filter, values } from 'lodash';
import { useUser } from '../../../api/user/hooks/useUser';

export type TAssignRoleModalProps = {
  isOpen: boolean;
  userId: TUserWithRoles[E_USER_ENTITY_KEYS.ID] | null;
  onSuccess(id: string, role: E_ROLE): void;
  onClose(): void;
};

export const AssignRoleModal = ({
  isOpen: openProps,
  userId,
  onClose,
  onSuccess,
}: TAssignRoleModalProps) => {
  const query = useUser(userId);

  const [open, setOpen] = useState(openProps);
  const [value, setValue] = useState<E_ROLE>();

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleChange = (event: SelectChangeEvent<E_ROLE>) => {
    setValue(event.target.value as E_ROLE);
  };

  const handleClose = () => {
    onClose();

    setOpen(false);
  };

  const handleSuccessClose = () => {
    if (!userId || !value) return;

    onSuccess(userId, value);

    setOpen(false);
  };

  if (!query || !query.data) return null;

  const { data, isLoading, error } = query;

  const possibleRoles = filter(
    values(E_ROLE),
    (role) =>
      !data[E_USER_ENTITY_KEYS.ROLES].some(
        (userRole) => userRole[E_ROLE_ENTITY_KEYS.NAME] === role,
      ),
  );

  return (
    <Dialog onClose={handleClose} open={open}>
      {data && (
        <DialogTitle>
          Assign role to {data[E_USER_ENTITY_KEYS.USERNAME]}
        </DialogTitle>
      )}
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isLoading && <CircularProgress />}

          {error && <Typography>Error: {error.message}</Typography>}

          {possibleRoles && (
            <FormControl fullWidth={true}>
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
      </DialogContent>
      <DialogActions>
        <Button color={'muted'} onClick={handleClose}>
          Cancel
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleSuccessClose}>Assign</Button>
      </DialogActions>
    </Dialog>
  );
};
