import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from '@tanstack/react-query';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';
import AuthService, {
  TAuthLoginResponse,
  TAuthRegisterMutationVariables,
} from '../../api/auth/auth.service';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import UserService from '../../api/user/user.service';

const SignUpPage = () => {
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

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

  const signUpMutation = useMutation({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstName,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastName,
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      password: password,
    }: TAuthRegisterMutationVariables) =>
      AuthService.signUp(firstName, lastName, username, password),
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

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    signUpMutation.mutate({
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstNameInput,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastNameInput,
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
          Sign up
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                required={true}
                fullWidth={true}
                label='First Name'
                autoFocus={true}
                onChange={(event) => setFirstNameInput(event.target.value)}
              />
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <TextField
                required={true}
                fullWidth={true}
                label='Last Name'
                autoComplete='family-name'
                onChange={(event) => setLastNameInput(event.target.value)}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                required={true}
                fullWidth={true}
                label='Username'
                autoComplete='username'
                onChange={(event) => setUsernameInput(event.target.value)}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                required={true}
                fullWidth={true}
                label='Password'
                type='password'
                autoComplete='new-password'
                onChange={(event) => setPasswordInput(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth={true}
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container={true} justifyContent='flex-end'>
            <Grid item={true}>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
