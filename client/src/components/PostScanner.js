import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import {
    Search as SearchIcon,
    Save as SaveIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const SearchForm = styled('form')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
}));

const ResultsList = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2)
}));

const PostScanner = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/facebook/scan-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data.results);
                if (data.results.length === 0) {
                    setError('לא נמצאו לידים פוטנציאליים בפוסט זה');
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLead = async (lead) => {
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(lead)
            });

            if (response.ok) {
                setResults(results.filter(r => r.id !== lead.id));
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRemoveResult = (leadId) => {
        setResults(results.filter(r => r.id !== leadId));
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                סריקת פוסט
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <SearchForm onSubmit={handleScan}>
                <TextField
                    fullWidth
                    label="קישור לפוסט בפייסבוק"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                    dir="ltr"
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !url.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                >
                    סרוק
                </Button>
            </SearchForm>

            {results.length > 0 && (
                <ResultsList>
                    {results.map((result) => (
                        <ListItem key={result.id}>
                            <ListItemText
                                primary={result.authorName}
                                secondary={result.content}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleSaveLead(result)}
                                    sx={{ mr: 1 }}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleRemoveResult(result.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </ResultsList>
            )}
        </Container>
    );
};

export default PostScanner; 