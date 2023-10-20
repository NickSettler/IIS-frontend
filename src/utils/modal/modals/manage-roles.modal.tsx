import { useEffect, useState } from 'react';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { map, startCase, values } from 'lodash';
import { useUser } from '../../hooks/useUser';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import List from '@mui/material/List';

export type TManageRolesModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.MANAGE_ROLES>;

export const ManageRolesModal = ({
  userID,
  onClose,
  onSuccess,
}: TManageRolesModalProps) => {
  const query = useUser(userID, {
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const [userRoles, setUserRoles] = useState<Array<E_ROLE> | null>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSuccessClose = () => {
    if (!userID || !userRoles) return;

    onSuccess(userID, userRoles);

    setUserRoles(null);
  };

  useEffect(() => {
    if (query?.data && userRoles === null) {
      const { [E_USER_ENTITY_KEYS.ROLES]: roles } = query.data;

      setUserRoles(map(roles, (role) => role[E_ROLE_ENTITY_KEYS.NAME]));
    }
  }, [query, userRoles]);

  const handleToggle = (toggleValue: E_ROLE) => () => {
    const currentIndex = userRoles?.includes(toggleValue) ?? false;
    const newChecked = [...(userRoles ?? [])];

    if (currentIndex) {
      newChecked.splice(newChecked.indexOf(toggleValue), 1);
    } else {
      newChecked.push(toggleValue);
    }

    setUserRoles(newChecked);
  };

  if (!query?.data) return null;

  const { data, isLoading, error } = query;

  const footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button color={'muted'} onClick={handleClose}>
        Cancel
      </Button>
      <Button onClick={handleSuccessClose}>Apply</Button>
    </Box>
  );

  return (
    <BaseModal
      show
      title={`Manage roles for ${data[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
        data[E_USER_ENTITY_KEYS.LAST_NAME]
      }`}
      onClose={handleClose}
      footer={footer()}
    >
      <Box sx={{ pt: 1 }}>
        {isLoading && <CircularProgress />}

        {error && <Typography>Error: {error.message}</Typography>}

        {data && (
          <List>
            {values(E_ROLE).map((role: E_ROLE) => (
              <ListItem key={role} disablePadding>
                <ListItemButton onClick={handleToggle(role)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={userRoles?.includes(role) ?? false}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={startCase(role)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </BaseModal>
  );
};

export default ManageRolesModal;
