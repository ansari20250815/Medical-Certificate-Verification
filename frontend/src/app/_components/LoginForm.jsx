'use client'

import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import CustomCheckbox from '../login/_components/CustomCheckbox'
import { signIn } from 'next-auth/react'

import { SnackBar, TextField } from '../libs/era'
import { useRouter } from 'next/navigation'
import { Snackbar } from '@mui/material'

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginFailed, setLoginFailed] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchLoginDetails = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('JWT token not found');
  
          const res = await fetch('http://localhost:8080/api/auth/loginDetails', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!res.ok) throw new Error('Failed to fetch login details');
  
          const data = await res.json();
          localStorage.setItem('loginDetails', JSON.stringify(data));
          router.push('/components'); // redirect after successful login
        } catch (error) {
          SnackBar.error('Failed to fetch login details. Please log in again.', { duration: 5000 });
          console.error('Error fetching login details:', error);
          // handle token error or redirect
        }
      }
    };
  
    fetchLoginDetails();
  }, [isLoggedIn]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        throw new Error('Invalid username or password');
        Snackbar.error('Invalid username or password', { duration: 5000 });
      }
  
      const data = await res.json();
      localStorage.setItem('token', data.token); // store token
      setLoginFailed(false);
      setIsLoggedIn(true); // will trigger useEffect to fetch user details
    } catch (error) {
      console.error('Login failed:', error);
      setLoginFailed(true);
      // Snackbar({
      //   title: 'Error',
      //   message: (
      //     'Login failed. Please check your credentials.'),
      //   type: 'error',
      // })
    }
  };
  
  return (
    <>
      <Grid container spacing={3}>
        {(title || subtext) && (
          <Grid item xs={12}>
            {title && (
              <Typography fontWeight='700' variant='h3' mb={0.5}>
                {title}
              </Typography>
            )}
            {subtext}
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField label='Username' id='username' fullWidth onChange={e => setUsername(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label='Password'
            id='password'
            type='password'
            fullWidth
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent='space-between' direction='row' alignItems='center'>
            <FormGroup>
              <FormControlLabel control={<CustomCheckbox defaultChecked />} label='Remember this Device' />
            </FormGroup>
            
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Button
            color='primary'
            variant='contained'
            size='large'
            fullWidth
            component={Link}
            href='/'
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Grid>
        {loginFailed && (
          <Grid item xs={12} style={{ color: 'red', textAlign: 'center' }}>
            Login Failed
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default AuthLogin
