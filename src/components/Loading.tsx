import { CircularProgress, Box } from '@mui/material';

export const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);