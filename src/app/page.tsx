"use client";

import styles from "./page.module.css";
import Header from "@/components/Header";
import { Button, Box, Typography, Container, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user/UserContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, getToken } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleContactsClick = () => {
    const token = getToken();
    if (token) {
      router.push('/contacts');
    } else {
      router.push('/login');
    };
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mt: { xs: 2, sm: 4 },
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              Group 28
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mt: { xs: 2, sm: 4 },
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                lineHeight: { xs: 1.3, sm: 1.4 },
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 600,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to Personal Contact Manager Dashboard
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            {!isClient ? (
              // Show loading state during hydration
              <Button
                variant="contained"
                size="large"
                disabled
                sx={{
                  minWidth: { xs: '100%', sm: 200 },
                  width: { xs: '100%', sm: 'auto' },
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  px: { xs: 3, sm: 2 },
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Loading...
              </Button>
            ) : user && getToken() ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<ContactsIcon />}
                onClick={handleContactsClick}
                sx={{
                  minWidth: { xs: '100%', sm: 200 },
                  width: { xs: '100%', sm: 'auto' },
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  px: { xs: 3, sm: 2 },
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Contacts Dashboard
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                startIcon={<GitHubIcon />}
                href="https://github.com/WilliamAW101/LAMP-Stack-Group-28"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  minWidth: { xs: '100%', sm: 200 },
                  width: { xs: '100%', sm: 'auto' },
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  px: { xs: 3, sm: 2 },
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                GitHub Repository
              </Button>
            )}
          </Stack>
        </Container>
      </main>
    </div>
  );
}
