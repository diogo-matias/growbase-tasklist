import { Stack, Snackbar as SnackbarMaterial, Alert, AlertColor } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  setOpen: any;
  message: string;
  severity: AlertColor;
}

export default function CustomSnackbar({ open, setOpen, message, severity }: CustomSnackbarProps) {
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <SnackbarMaterial
          open={open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={severity || 'success'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </SnackbarMaterial>
      </Stack>
    </>
  );
}
