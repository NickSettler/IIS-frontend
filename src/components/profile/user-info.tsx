import React, { JSX, useMemo } from 'react';
import { useMe } from '../../utils/hooks/user/useMe';
import { Navigate } from 'react-router-dom';
import {
  Icon,
  Skeleton,
  Stack,
  Typography,
  Link,
  Tooltip,
} from '@mui/material';
import { CopyAll, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';

export const ProfileUserInfo = (): JSX.Element => {
  const { data, isLoading, error } = useMe();

  const id = useMemo(() => (data ? data[E_USER_ENTITY_KEYS.ID] : ''), [data]);
  const firstName = useMemo(
    () => (data ? data[E_USER_ENTITY_KEYS.FIRST_NAME] : ''),
    [data],
  );
  const lastName = useMemo(
    () => (data ? data[E_USER_ENTITY_KEYS.LAST_NAME] : ''),
    [data],
  );
  const username = useMemo(
    () => (data ? data[E_USER_ENTITY_KEYS.USERNAME] : ''),
    [data],
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

  if (error) return <Navigate to={'/'} />;

  return (
    <Stack maxWidth={'33.33%'} gap={1}>
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
      <Stack gap={1}>
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
  );
};
