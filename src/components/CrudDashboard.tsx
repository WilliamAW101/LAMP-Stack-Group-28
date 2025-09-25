"use client"

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import NotificationsProvider from '../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../hooks/useDialogs/DialogsProvider';
import AppTheme from '../theme/AppTheme';
import {
  sidebarCustomizations,
  formInputCustomizations,
} from '../theme/customizations';

const themeComponents = {
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          {/* App Router will handle routing through the file structure */}
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
