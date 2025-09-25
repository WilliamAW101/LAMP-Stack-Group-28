"use client"

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import SitemarkIcon from "../components/icons/SitemarkIcon"
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
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  padding: '0 12px',
}));

export default function AppAppBar() {
  const router = useRouter();
  const { user, logout, getToken } = useUser();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  // Only check authentication after client-side hydration
  React.useEffect(() => {
    setIsClient(true);
    setIsAuthenticated(!!getToken());
  }, [getToken]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
        <StyledToolbar variant="dense" disableGutters sx={{ px: 2 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <SitemarkIcon />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
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
                  sx={{ ml: 2 }}
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
                  size="medium"
                  onClick={redirectLoginPage}
                  sx={{
                    color: "#47536B",         // muted gray-blue text
                    textTransform: "none",    // keep text case
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "transparent", // no background on hover
                      textDecoration: "underline",    // optional, for link-like effect
                    },
                  }}
                >
                  Sign in
                </Button>

                <Button
                  variant="contained"
                  size="medium"
                  onClick={redirectSignupPage}
                  sx={{
                    backgroundColor: "#05070a", // dark background
                    color: "#fff",              // white text
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",          // remove default shadow
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#1a1d21", // slightly lighter on hover
                      boxShadow: "none",
                    },
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