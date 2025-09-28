"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../Header';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(!isMobile);


    React.useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            background: '#ffffff',
            ...theme.applyStyles('dark', {
                background: '#f5f5f5',
            }),
        }}>
            <CssBaseline />
            <Header />
            <Main
                open={open}
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    pt: { xs: 8, sm: 10 },
                    pb: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2, md: 3 },
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
                        `,
                        zIndex: 0,
                    },
                    '& > *': {
                        position: 'relative',
                        zIndex: 1,
                    }
                }}
            >
                {children}
            </Main>
        </Box>
    );
}
