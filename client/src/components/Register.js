import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fadeIn, slideUp } from '../animations';

const RegisterContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
}));

const RegisterCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    borderRadius: 8,
    fontSize: '1.1rem'
}));

const LoginLink = styled(Link)(({ theme }) => ({
    marginTop: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline'
    }
}));

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'שגיאה בהרשמה');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterContainer maxWidth={false}>
            <RegisterCard elevation={4}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    הרשמה
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
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
                    <StyledTextField
                        fullWidth
                        label="אימות סיסמה"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
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
                        {loading ? <CircularProgress size={24} /> : 'הירשם'}
                    </SubmitButton>
                </form>

                <LoginLink component={RouterLink} to="/login">
                    יש לך כבר חשבון? התחבר כאן
                </LoginLink>
            </RegisterCard>
        </RegisterContainer>
    );
};

export default Register; 