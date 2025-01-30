import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing(4)
}));

const ErrorIcon = styled(ErrorIcon)(({ theme }) => ({
    fontSize: 64,
    color: theme.palette.error.main
}));

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorIcon />
                    <Typography variant="h5" align="center" gutterBottom>
                        אופס! משהו השתבש
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                        {this.state.error?.message || 'אירעה שגיאה בלתי צפויה'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReset}
                    >
                        נסה שוב
                    </Button>
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 