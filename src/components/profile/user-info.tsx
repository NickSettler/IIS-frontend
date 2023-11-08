import React, { JSX, useEffect, useMemo } from 'react';
import { useMe } from '../../utils/hooks/user/useMe';
import { Navigate } from 'react-router-dom';
import {
  Icon,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { CopyAll, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
} from '../../api/user/types';
import Grid from '@mui/material/Grid';
import { ProfileTeacherRequirements } from './teacher-requirements';
import { some } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';

export const ProfileUserInfo = (): JSX.Element => {
  const { data, isLoading } = useMe();

  const [user, setUser] = useLocalStorage<TApiUserWithRoles | null>(
    E_LOCAL_STORAGE_KEYS.USER_INFO,
    null,
  );

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  const id = useMemo(() => user?.[E_USER_ENTITY_KEYS.ID] ?? '', [user]);
  const firstName = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.FIRST_NAME] ?? '',
    [user],
  );
  const lastName = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.LAST_NAME] ?? '',
    [user],
  );
  const username = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.USERNAME] ?? '',
    [user],
  );

  const handleIDCopy = () => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success('ID copied');
      })
      .catch(() => {
        toast.error('Failed to copy ID');
      });
  };

  const isTeacher = useMemo(() => {
    return some(
      user?.[E_USER_ENTITY_KEYS.ROLES],
      (role) => role[E_ROLE_ENTITY_KEYS.NAME] === E_ROLE.TEACHER,
    );
  }, [user]);

  if (!user) return <Navigate to={'/'} />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={4}>
        <Stack spacing={2}>
          <Typography variant={'h6'}>User info</Typography>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton
                variant={'text'}
                animation={'wave'}
                sx={{ maxWidth: 'initial' }}
              >
                <Typography variant={'caption'} flexGrow={1}>
                  ID:
                </Typography>
              </Skeleton>
            ) : (
              <Stack direction={'row'} gap={1} alignItems={'center'}>
                <Typography variant={'caption'}>ID: {id}</Typography>
                <Link
                  sx={{ cursor: 'pointer', fontSize: '0.25rem' }}
                  onClick={handleIDCopy}
                >
                  <CopyAll fontSize={'small'} />
                </Link>
              </Stack>
            )}
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant={'rectangular'}
                  animation={'wave'}
                  sx={{ maxWidth: 'initial' }}
                />
              ))
            ) : (
              <>
                <Stack
                  direction={'row'}
                  gap={1}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography variant={'body1'}>First name</Typography>
                  <Typography variant={'h6'}>{firstName}</Typography>
                </Stack>
                <Stack
                  direction={'row'}
                  gap={1}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography variant={'body1'}>Last name</Typography>
                  <Typography variant={'h6'}>{lastName}</Typography>
                </Stack>
                <Stack
                  direction={'row'}
                  gap={1}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography variant={'body1'}>Username</Typography>
                  <Typography variant={'h6'}>{username}</Typography>
                </Stack>
                <Stack
                  direction={'row'}
                  gap={1}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography variant={'body1'}>Password</Typography>
                  <Typography variant={'h6'}>
                    <Tooltip title={'Password is hidden'}>
                      <Icon color={'warning'} fontSize={'small'}>
                        <VisibilityOff fontSize={'small'} />
                      </Icon>
                    </Tooltip>
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Grid>
      {isTeacher && (
        <Grid item xs={12} lg={8}>
          <Stack spacing={2}>
            <Typography variant={'h6'}>Teacher requirements</Typography>
            <ProfileTeacherRequirements />
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};
