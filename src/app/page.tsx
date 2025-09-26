"use client";

import styles from "./page.module.css";
import Header from "@/components/Header";
import { Button, Box, Typography, Container, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user/UserContext';

export default function Home() {
  const router = useRouter();
  const { user, getToken } = useUser();

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
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Group 28
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mt: { xs: 2, sm: 4 },
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                lineHeight: { xs: 1.3, sm: 1.4 }
              }}
            >
              Welcome to Personal Contact Manager Dashboard
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Manage your contacts efficiently with our modern dashboard
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            {user && getToken() && (
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
                  px: { xs: 3, sm: 2 }
                }}
              >
                Contacts Dashboard
              </Button>
            )}

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
                px: { xs: 3, sm: 2 }
              }}
            >
              GitHub Repository
            </Button>
          </Stack>
        </Container>
      </main>
    </div>
  );
}
