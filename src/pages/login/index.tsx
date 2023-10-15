import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from '@tanstack/react-query';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';
import AuthService, {
  TAuthLoginMutationVariables,
  TAuthLoginResponse,
} from '../../api/auth/auth.service';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import UserService from '../../api/user/user.service';

const LogInPage = () => {
  const [usernameInput, setUsernameInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');

  const getUserInfoMutation = useMutation({
    mutationFn: async () => UserService.getMe(),
    onSuccess: ({
      [E_LOCAL_STORAGE_KEYS.ID]: id,
      [E_LOCAL_STORAGE_KEYS.USERNAME]: username,
      [E_LOCAL_STORAGE_KEYS.FIRST_NAME]: firstName,
      [E_LOCAL_STORAGE_KEYS.LAST_NAME]: lastName,
    }) => {
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.ID, id);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.USERNAME, username);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.FIRST_NAME, firstName);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.LAST_NAME, lastName);
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      password: password,
    }: TAuthLoginMutationVariables) => AuthService.signIn(username, password),
    onSuccess: ({
      accessToken,
      refreshToken,
      expiresIn,
    }: TAuthLoginResponse) => {
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.EXPIRES_IN, expiresIn);

      getUserInfoMutation.mutate();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInMutation.mutate({
      [E_USER_ENTITY_KEYS.USERNAME]: usernameInput,
      password: passwordInput,
    });
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            required={true}
            fullWidth={true}
            label='Username'
            autoComplete='username'
            autoFocus={true}
            onChange={(event) => setUsernameInput(event.target.value)}
          />
          <TextField
            margin='normal'
            required={true}
            fullWidth={true}
            label='Password'
            type='password'
            autoComplete='current-password'
            onChange={(event) => setPasswordInput(event.target.value)}
          />
          <Button
            type='submit'
            fullWidth={true}
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link href='/register' variant='body2'>
            Don&apos;t have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LogInPage;
