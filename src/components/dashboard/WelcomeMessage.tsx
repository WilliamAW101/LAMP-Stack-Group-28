"use client";

import * as React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useUser } from '@/context/user/UserContext';
import PersonIcon from '@mui/icons-material/Person';

export default function WelcomeMessage() {
    const { user } = useUser();

    if (!user || !user.first_name) {
        return null;
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: 56,
                        height: 56,
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                        {getGreeting()}, {user.first_name}! 👋
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Welcome to your Personal Contact Manager Dashboard
                    </Typography>
                    {user.last_name && (
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                            {user.first_name} {user.last_name}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
