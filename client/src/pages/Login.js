import React from 'react';
import FacebookLogin from '../components/FacebookLogin';
import { Box, Container, Typography } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          התחברות למערכת
        </Typography>
        <Box sx={{ mt: 3 }}>
          <FacebookLogin />
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 