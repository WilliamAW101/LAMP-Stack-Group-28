"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import { Button, Box, Typography, Container, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleContactsClick = () => {
    router.push('/contacts');
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
              Group 28
            </Typography>
            <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
              Welcome to Personal Contact Manager Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Manage your contacts efficiently with our modern dashboard
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ContactsIcon />}
              onClick={handleContactsClick}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Contacts Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
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
