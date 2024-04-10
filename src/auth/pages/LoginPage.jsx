import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';

import { AuthLayout } from '../layout/AuthLayout';

import { useForm } from '../../hooks';
import { startGoogleSingIn, startLoginWithEmailPassword } from '../../store/auth';

// Recordar que se hizo de esta manera porque si mando directamente un objeto nuevo al useForm se hace un bucle con el 
// efecto que dice que si cambia el initialForm se redibuje
const formInitialData = {
  email: '',
  password: '',
};

export const LoginPage = () => {

  const { email, password, onInputChange, formState } = useForm( formInitialData );

  const { status, errorMessage } = useSelector((state) => state.auth);

  const isAuthenticating = useMemo( () => status==='checking', [status] ); 

  const dispatch = useDispatch();

  const onSubmit = ( event ) => {
    event.preventDefault();

    // console.log({email, password});

    dispatch( startLoginWithEmailPassword( formState ) );
  }

  const onGoogleSingIn = () => {
    // console.log('onGoogleSingIn');
    dispatch( startGoogleSingIn() );
  }

  return (

    <AuthLayout title="Login">

      <form onSubmit={onSubmit} className='animate__animated animate__fadeIn animate__faster' >

        <Grid container>

          <Grid item xs={12} sx={{mt: 2}}>
            <TextField 
            label= "Correo" 
            type="email" 
            placeholder="correo@google.com"
            fullWidth
            name="email"
            value={email}
            onChange={ onInputChange }
            />
          </Grid>

          <Grid item xs={12} sx={{mt: 2}}>
            <TextField 
            label= "Contraseña" 
            type="password" 
            placeholder='contraseña'
            fullWidth
            name="password"
            value={password}
            onChange={ onInputChange }
            />
          </Grid>

          <Grid container spacing={2} sx={{mb: 2, mt: 1}}>

            <Grid item xs={12} sm={12} display={ !!errorMessage ? '' : 'none' }>
              <Alert severity='error'>{ errorMessage }</Alert>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button disabled={isAuthenticating} type="submit" variant='contained' fullWidth>
                Login
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button disabled={isAuthenticating} variant='contained' fullWidth onClick={ onGoogleSingIn }>
                <Google  />
                <Typography sx={{ml: 1}}>Google</Typography>
              </Button>
            </Grid>

          </Grid>

          <Grid container direction='row' justifyContent='end'>
            <Link component={RouterLink} color='inherit' to="/auth/register">
              Crear una cuenta
            </Link>
          </Grid>

        </Grid>

      </form>
      
    </AuthLayout>
    
  )
}
