import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fadeIn, slideUp } from '../animations';

const LoginContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    animation: `${fadeIn} 1s ease-out`
}));

const LoginCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    animation: `${slideUp} 0.5s ease-out`,
    animationDelay: '0.3s',
    animationFillMode: 'backwards'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)'
        },
        '&.Mui-focused': {
            transform: 'translateY(-2px)'
        }
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    borderRadius: 8,
    fontSize: '1.1rem'
}));

const RegisterLink = styled(Link)(({ theme }) => ({
    marginTop: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline'
    }
}));

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'שגיאה בהתחברות');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer maxWidth={false}>
            <LoginCard elevation={4}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    התחברות
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <StyledTextField
                        fullWidth
                        label="אימייל"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        margin="normal"
                        required
                        dir="rtl"
                    />
                    <StyledTextField
                        fullWidth
                        label="סיסמה"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                        margin="normal"
                        required
                        dir="rtl"
                    />
                    <SubmitButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'התחבר'}
                    </SubmitButton>
                </Box>

                <RegisterLink component={RouterLink} to="/register">
                    אין לך חשבון? הירשם כאן
                </RegisterLink>
            </LoginCard>
        </LoginContainer>
    );
};

export default Login; 