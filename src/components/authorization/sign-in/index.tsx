import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation, useQuery } from '@tanstack/react-query';
import { E_USER_ENTITY_KEYS, TUserWithRoles } from '../../../api/user/types';
import AuthService, {
  TAuthLoginMutationVariables,
  TAuthLoginResponse,
} from '../../../api/auth/auth.service';
import LocalStorage, {
  E_LOCAL_STORAGE_KEYS,
} from '../../../utils/local-storage';

const SignIn = () => {
  const [isEmailError, setIsEmailError] = React.useState(false);
  const [isPasswordError, setIsPasswordError] = React.useState(false);

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
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // remove error after filling the form
    setIsEmailError(!data.get('username'));
    setIsPasswordError(!data.get('password'));

    if (!data.get('username') || !data.get('password')) {
      return;
    }

    signInMutation.mutate({
      [E_USER_ENTITY_KEYS.USERNAME]: data.get('username') as string,
      password: data.get('password') as string,
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
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate={true}
          sx={{ mt: 1 }}
        >
          <TextField
            required={true}
            fullWidth={true}
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus={true}
            error={isEmailError}
            onClick={() => setIsEmailError(false)}
          />
          <TextField
            margin='normal'
            required={true}
            fullWidth={true}
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            error={isPasswordError}
            onClick={() => setIsPasswordError(false)}
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

export default SignIn;
