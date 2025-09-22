"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import GoogleIcon from "../components/icons/GoogleIcon"
import FacebookIcon from "../components/icons/FacebookIcon"
import SitemarkIcon from "../components/icons/SitemarkIcon"
import { useToast } from '@/context/toast';
import { useUser } from '@/context/user/UserContext';
import { useRouter } from 'next/navigation';



const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  backgroundColor: 'rgba(68, 95, 71, 0.85) !important', 
  color: '#fffaf5', // light cream text
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(68, 95, 71, 0.85) !important', 
  }),
}));





const SignInContainer = styled(Stack)(({ theme }) => ({
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



export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const { setUser } = useUser();
  const toast = useToast()
  const router = useRouter()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent default form submission

    if (emailError || passwordError) {
      return;
    }

    const data = new FormData(event.currentTarget);

    // Convert FormData to JSON object
    const jsonData = {
      login: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await fetch('http://localhost:8000/Login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // send JSON
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json(); // assuming PHP returns JSON
      toast.success("Login successfully");

      router.push("/")
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };


  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

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

    return isValid;
  };




  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {/* Email field */}
            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: '#f5eee6' }}>Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
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
              />
            </FormControl>

            {/* Password field */}
            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: '#f5eee6' }}>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                sx={{
                  input: { color: '#f5eee6' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#f5eee6' },
                    '&:hover fieldset': { borderColor: '#8b5e3c' },
                    '&.Mui-focused fieldset': { borderColor: '#5a4030' },
                  },
                  '& .MuiFormHelperText-root': { color: '#f5eee6' },
                }}
              />
            </FormControl>

            {/* Sign in button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                backgroundColor: '#f5eee6', // light cream
                color: '#5a4030', // dark brown text
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#8b5e3c', // dark brown
                  color: '#f5eee6', // light cream text
                },
                '&:focus-visible': { boxShadow: '0 0 0 3px rgba(90,64,48,0.4)' },
              }}
            >
              Sign in
            </Button>

            {/* Social sign-in buttons */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
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
              Sign in with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
              sx={{
                borderColor: '#5a4030',
                color: '#5a4030',
                fontWeight: 'bold',
                backgroundColor: '#f5eee6',
                '&:hover': { backgroundColor: '#8b5e3c', color: '#f5eee6' },
              }}
            >
              Sign in with Facebook
            </Button>


            {/* Sign up link */}
            <Typography sx={{ textAlign: 'center', mt: 1 }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                variant="body2"
                sx={{
                  color: '#b47c4c',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
