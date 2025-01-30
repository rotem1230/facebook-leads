import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { Facebook as FacebookIcon } from '@mui/icons-material';

const FacebookConnect = ({ isConnected, onConnect }) => {
    const [error, setError] = useState('');

    const handleConnect = async () => {
        try {
            // כאן יהיה הקוד להתחברות לפייסבוק
            onConnect();
        } catch (error) {
            setError('אירעה שגיאה בהתחברות לפייסבוק');
        }
    };

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {isConnected ? (
                <Alert severity="success">
                    מחובר לפייסבוק
                </Alert>
            ) : (
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography>
                        יש להתחבר לפייסבוק כדי להתחיל
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FacebookIcon />}
                        onClick={handleConnect}
                        sx={{ bgcolor: '#1877F2' }}
                    >
                        התחבר לפייסבוק
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default FacebookConnect; 