"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import GoogleIcon from "../components/icons/GoogleIcon"
import FacebookIcon from "../components/icons/FacebookIcon"
import SitemarkIcon from "../components/icons/SitemarkIcon"
import { useToast } from '@/context/toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user/UserContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  backgroundColor: 'rgba(68, 95, 71, 0.85) !important', // very dark brown
  color: '#fffaf5', // light cream text
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(68, 95, 71, 0.85) !important', // dark mode override
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100dvh',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  position: 'relative',
  backgroundImage: 'url("background.jpg")', // make sure image is in public/images
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    // Optional: lighter overlay for readability
    backgroundColor: 'rgba(179, 218, 176, 0.3)', // light cream overlay, less dark
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [firstnameError, setFirstNameError] = React.useState(false);
  const [lastnameError, setLastNameError] = React.useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');

  const toast = useToast()
  const router = useRouter()
  const { setUser } = useUser();


  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const firstname = document.getElementById('firstname') as HTMLInputElement;
    const lastname = document.getElementById('lastname') as HTMLInputElement;


    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!firstname.value || firstname.value.length < 1) {
      setFirstNameError(true);
      setFirstNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage('');
    }

    if (!lastname.value || lastname.value.length < 1) {
      setLastNameError(true);
      setLastNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent default form submission

    if (firstnameError || lastnameError || emailError || passwordError) {
      return;
    }

    const data = new FormData(event.currentTarget);

    // Convert FormData to JSON object
    const jsonData = {
      login: data.get('email'),
      password: data.get('password'),
      first_name: data.get('firstname'),
      last_name: data.get('lastname'),
      // email: data.get('email'),
      // phone: data.get('phone'),
    };

    try {
      const response = await fetch('http://localhost:8000/Signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // send JSON
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json(); // assuming PHP returns JSON
      toast.success("Create account successfully");

      setUser({
        first_name: result.firstname,
        last_name: result.lastname,
      });
      router.push("/")
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };


  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <Link
            href="/"
            variant="body2"
            sx={{
              color: '#f5eee6', 
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline', color: '#5a4030' },
            }}
          >
            ← Back to Home
          </Link>
        </Box>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="first name">First name</FormLabel>
              <TextField
                autoComplete="firstname"
                name="firstname"
                required
                fullWidth
                id="firstname"
                placeholder="Jon"
                sx={{
                  input: { color: '#f5eee6' }, // light cream text
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f5eee6' }, // dark brown border
                    '&:hover fieldset': { borderColor: '#8b5e3c' }, // hover slightly lighter brown
                    '&.Mui-focused fieldset': { borderColor: '#5a4030' },
                  },
                  '& .MuiFormHelperText-root': { color: '#f5eee6' }, // error/helper text
                }}
                error={firstnameError}
                helperText={firstNameErrorMessage}
                color={firstnameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Last name</FormLabel>
              <TextField
                autoComplete="lastname"
                name="lastname"
                required
                fullWidth
                id="lastname"
                placeholder="Snow"
                sx={{
                  input: { color: '#f5eee6' }, // light cream text
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f5eee6' }, // dark brown border
                    '&:hover fieldset': { borderColor: '#8b5e3c' }, // hover slightly lighter brown
                    '&.Mui-focused fieldset': { borderColor: '#5a4030' },
                  },
                  '& .MuiFormHelperText-root': { color: '#f5eee6' }, // error/helper text
                }}
                error={lastnameError}
                helperText={lastNameErrorMessage}
                color={lastnameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                sx={{
                  input: { color: '#f5eee6' }, // light cream text
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f5eee6' }, // dark brown border
                    '&:hover fieldset': { borderColor: '#8b5e3c' }, // hover slightly lighter brown
                    '&.Mui-focused fieldset': { borderColor: '#5a4030' },
                  },
                  '& .MuiFormHelperText-root': { color: '#f5eee6' }, // error/helper text
                }}
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                sx={{
                  input: { color: '#f5eee6' }, // light cream text
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f5eee6' }, // dark brown border
                    '&:hover fieldset': { borderColor: '#8b5e3c' }, // hover slightly lighter brown
                    '&.Mui-focused fieldset': { borderColor: '#5a4030' },
                  },
                  '& .MuiFormHelperText-root': { color: '#f5eee6' }, // error/helper text
                }}
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                borderColor: '#5a4030', // dark brown
                color: '#5a4030', // dark brown text
                fontWeight: 'bold',
                backgroundColor: '#f5eee6', // light cream background
                '&:hover': {
                  backgroundColor: '#8b5e3c', // dark brown
                  color: '#f5eee6', // light cream text
                },
              }}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              sx={{
                borderColor: '#5a4030', // dark brown
                color: '#5a4030', // dark brown text
                fontWeight: 'bold',
                backgroundColor: '#f5eee6', // light cream background
                '&:hover': {
                  backgroundColor: '#8b5e3c', // dark brown
                  color: '#f5eee6', // light cream text
                },
              }}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              sx={{
                borderColor: '#5a4030', // dark brown
                color: '#5a4030', // dark brown text
                fontWeight: 'bold',
                backgroundColor: '#f5eee6', // light cream background
                '&:hover': {
                  backgroundColor: '#8b5e3c', // dark brown
                  color: '#f5eee6', // light cream text
                },
              }}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                variant="body2"
                sx={{ 
                  alignSelf: 'center',
                  color: '#b47c4c',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline', color: '#f5eee6' },
                 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}