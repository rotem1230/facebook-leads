import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../animations';

const SpinnerContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    animation: `${fadeIn} 0.3s ease-out`,
    gap: theme.spacing(2)
}));

const LoadingText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary
}));

const LoadingSpinner = ({ text = 'טוען...' }) => {
    return (
        <SpinnerContainer>
            <CircularProgress />
            <LoadingText variant="body2">{text}</LoadingText>
        </SpinnerContainer>
    );
};

export default LoadingSpinner; 