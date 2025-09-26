'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Container, { ContainerProps } from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from 'next/link';

const PageContentHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const PageHeaderToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  // Ensure the toolbar is always on the right side, even after wrapping
  marginLeft: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
    justifyContent: 'flex-start',
  },
}));

export interface Breadcrumb {
  title: string;
  path?: string;
}
export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export default function PageContainer(props: PageContainerProps) {
  const { children, breadcrumbs, title, actions = null } = props;

  return (
    <Container
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 1, sm: 2 },
        maxWidth: { xs: '100%', sm: '100%', md: '1200px' }
      }}
    >
      <Stack sx={{ flex: 1, my: { xs: 1, sm: 2 } }} spacing={{ xs: 1, sm: 2 }}>
        <Stack>
          <PageHeaderBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '& .MuiBreadcrumbs-separator': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            {breadcrumbs
              ? breadcrumbs.map((breadcrumb, index) => {
                return breadcrumb.path ? (
                  <MuiLink
                    key={index}
                    component={Link}
                    underline="hover"
                    color="inherit"
                    href={breadcrumb.path}
                    sx={{ fontSize: 'inherit' }}
                  >
                    {breadcrumb.title}
                  </MuiLink>
                ) : (
                  <Typography
                    key={index}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      fontSize: 'inherit'
                    }}
                  >
                    {breadcrumb.title}
                  </Typography>
                );
              })
              : null}
          </PageHeaderBreadcrumbs>
          <PageContentHeader>
            {title ? (
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  lineHeight: { xs: 1.3, sm: 1.4 }
                }}
              >
                {title}
              </Typography>
            ) : null}
            <PageHeaderToolbar>{actions}</PageHeaderToolbar>
          </PageContentHeader>
        </Stack>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      </Stack>
    </Container>
  );
}
