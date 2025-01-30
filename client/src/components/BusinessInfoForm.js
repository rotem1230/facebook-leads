import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const BusinessInfoForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBusinessInfo();
    }, []);

    const fetchBusinessInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/business');
            
            if (response.status === 404) {
                return;
            }

            if (!response.ok) {
                throw new Error('אירעה שגיאה בטעינת פרטי העסק');
            }

            const data = await response.json();
            if (data.businessInfo) {
                setFormData(data.businessInfo);
            }
        } catch (error) {
            console.error('Error fetching business info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name?.trim()) {
            setError('שם העסק הוא שדה חובה');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name?.trim(),
                    description: formData.description?.trim(),
                    phone: formData.phone?.trim(),
                    email: formData.email?.trim(),
                    website: formData.website?.trim(),
                    address: formData.address?.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('פרטי העסק נשמרו בהצלחה');
                if (data.businessInfo) {
                    setFormData(data.businessInfo);
                }
            } else {
                throw new Error(data.message || 'אירעה שגיאה בשמירת פרטי העסק');
            }
        } catch (error) {
            console.error('Error saving business info:', error);
            setError(error.message || 'אירעה שגיאה בשמירת פרטי העסק');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                פרטי העסק
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="שם העסק"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="תיאור העסק"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="טלפון"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="דוא״ל"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="אתר אינטרנט"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="כתובת"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            sx={{ mt: 2 }}
                        >
                            {saving ? <CircularProgress size={24} /> : 'שמור'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default BusinessInfoForm; 