import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import type { Contact } from '@/data/contacts';

export interface ContactFormState {

  values: Partial<Omit<Contact, 'id'>>;
  errors: Partial<Record<keyof ContactFormState['values'], string>>;
}

export type FormFieldValue = string | string | string | string;

export interface ContactFormProps {
  formState: ContactFormState;
  onFieldChange: (
    name: keyof ContactFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<ContactFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<ContactFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function ContactForm(props: ContactFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ContactFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleFirstNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ContactFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );


  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    router.push(backButtonPath ?? '/contacts');
  }, [router, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>

        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.first_name ?? ''}
              onChange={handleFirstNameChange}
              name="first_name"
              label="First name"
              error={!!formErrors.first_name}
              helperText={formErrors.first_name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="string"
              value={formValues.last_name ?? ''}
              onChange={handleTextFieldChange}
              name="last_name"
              label="Last Name"
              error={!!formErrors.last_name}
              helperText={formErrors.last_name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="string"
              value={formValues.phone ?? ''}
              onChange={handleTextFieldChange}
              name="phone"
              label="Phone"
              error={!!formErrors.phone}
              helperText={formErrors.phone ?? ' '}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="string"
              value={formValues.email ?? ''}
              onChange={handleTextFieldChange}
              name="email"
              label="Email"
              error={!!formErrors.email}
              helperText={formErrors.email ?? ' '}
              fullWidth
            />
          </Grid>

        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
