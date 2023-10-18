import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from '@tanstack/react-query';
import { E_USER_ENTITY_KEYS, TApiUserWithRoles } from '../../api/user/types';
import AuthService, {
  TAuthLoginMutationVariables,
  TAuthLoginResponse,
} from '../../api/auth/auth.service';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import UserService from '../../api/user/user.service';
import { useLocalStorage } from 'usehooks-ts';
import { Link, Navigate } from 'react-router-dom';

const LogInPage = () => {
  const [, setAccessToken] = useLocalStorage<string | null>(
    E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    null,
  );
  const [, setRefreshToken] = useLocalStorage<string | null>(
    E_LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
    null,
  );
  const [user, setUser] = useLocalStorage<TApiUserWithRoles | null>(
    E_LOCAL_STORAGE_KEYS.USER_INFO,
    null,
  );

  const [usernameInput, setUsernameInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');

  const getUserInfoMutation = useMutation({
    mutationFn: async () => UserService.getMe(),
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      password: password,
    }: TAuthLoginMutationVariables) => AuthService.signIn(username, password),
    onSuccess: ({ accessToken, refreshToken }: TAuthLoginResponse) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

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

  if (user) {
    return <Navigate to='/' />;
  }

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
            required
            fullWidth
            label='Username'
            autoComplete='username'
            autoFocus
            onChange={(event) => setUsernameInput(event.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            autoComplete='current-password'
            onChange={(event) => setPasswordInput(event.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button component={Link} to='/register' variant='text'>
            Don&apos;t have an account? Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LogInPage;
