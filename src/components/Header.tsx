"use client"

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/user/UserContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  padding: '0 12px',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(44, 62, 80, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }),
}));

interface AppAppBarProps {
  variant?: 'homepage' | 'default';
}

export default function AppAppBar({ variant = 'homepage' }: AppAppBarProps = {}) {
  const router = useRouter();
  const { logout, getToken } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  // Only check authentication after client-side hydration
  React.useEffect(() => {
    setIsClient(true);
    setIsAuthenticated(!!getToken());
  }, [getToken]);


  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    router.push('/');
  };

  const redirectLoginPage = () => {
    router.push("/login")
  }

  const redirectSignupPage = () => {
    router.push("/signup")
  }

  return (
    <Box sx={{
      flexGrow: 1
    }}>
      <AppBar
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 'calc(var(--template-frame-height, 0px))',
          width: '100%',
        }}
      >
        <StyledToolbar variant="dense" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
          </Box>
          <Box
            sx={{
              display: { xs: 'flex', md: 'flex' },
              gap: { xs: 0.5, sm: 1 },
              alignItems: 'center',
              flexDirection: { xs: 'row', sm: 'row' },
            }}
          >
            {!isClient ? (
              // Show loading state during hydration
              <>
                <Button color="primary" variant="text" size="small" disabled>
                  Loading...
                </Button>
              </>
            ) : isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleUserMenuClick}
                  size="small"
                  sx={{
                    ml: 2,
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                    }
                  }}
                  aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  onClick={handleUserMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { handleUserMenuClose(); router.push('/contacts'); }}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  size="small"
                  onClick={redirectLoginPage}
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    px: { xs: 1.5, sm: 2.5 },
                    minWidth: { xs: 'auto', sm: 'auto' },
                    borderRadius: "6px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  Sign in
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={redirectSignupPage}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#2c3e50",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: "6px",
                    px: { xs: 2, sm: 3 },
                    minWidth: { xs: 'auto', sm: 'auto' },
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      color: "#1a252f",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
}