import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from '@tanstack/react-query';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import AuthService, {
  TAuthLoginResponse,
  TAuthRegisterMutationVariables,
} from '../../../api/auth/auth.service';
import LocalStorage, {
  E_LOCAL_STORAGE_KEYS,
} from '../../../utils/local-storage';

const SignUp = () => {
  const [isFirstNameError, setIsFirstNameError] = React.useState(false);
  const [isLastNameError, setIsLastNameError] = React.useState(false);
  const [isUsernameError, setIsUsernameError] = React.useState(false);
  const [isPasswordError, setIsPasswordError] = React.useState(false);

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
      console.log(accessToken, refreshToken, expiresIn);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      LocalStorage.setItem(E_LOCAL_STORAGE_KEYS.EXPIRES_IN, expiresIn);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    // remove error after filling the form
    setIsUsernameError(!data.get('username'));
    setIsPasswordError(!data.get('password'));
    setIsFirstNameError(!data.get('firstName'));
    setIsLastNameError(!data.get('lastName'));

    if (
      !data.get('username') ||
      !data.get('password') ||
      !data.get('firstName') ||
      !data.get('lastName')
    ) {
      return;
    }

    signUpMutation.mutate({
      [E_USER_ENTITY_KEYS.FIRST_NAME]: data.get('firstName') as string,
      [E_USER_ENTITY_KEYS.LAST_NAME]: data.get('lastName') as string,
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
          Sign up
        </Typography>
        <Box
          component='form'
          noValidate={true}
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                name='firstName'
                required={true}
                fullWidth={true}
                id='firstName'
                label='First Name'
                autoFocus={true}
                error={isFirstNameError}
              />
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <TextField
                required={true}
                fullWidth={true}
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='family-name'
                error={isLastNameError}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                required={true}
                fullWidth={true}
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                error={isUsernameError}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                required={true}
                fullWidth={true}
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='new-password'
                error={isPasswordError}
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

export default SignUp;
