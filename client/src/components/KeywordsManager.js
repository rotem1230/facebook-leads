import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const KeywordInput = styled(TextField)(({ theme }) => ({
    marginRight: theme.spacing(1)
}));

const KeywordsContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
}));

const KeywordsManager = () => {
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchKeywords();
    }, []);

    const fetchKeywords = async () => {
        try {
            const response = await fetch('/api/keywords');
            const data = await response.json();
            
            if (response.ok) {
                setKeywords(data.keywords || []);
            } else {
                throw new Error(data.message || 'אירעה שגיאה בטעינת מילות המפתח');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddKeyword = async (e) => {
        e.preventDefault();
        if (!newKeyword.trim()) {
            setError('נא להזין מילת מפתח');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/keywords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword: newKeyword.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                setKeywords(data.keywords || []);
                setNewKeyword('');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteKeyword = async (index) => {
        try {
            const keyword = keywords[index];
            const response = await fetch(`/api/keywords/${encodeURIComponent(keyword)}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setKeywords(data.keywords || []);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
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
                ניהול מילות מפתח
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleAddKeyword} display="flex" gap={1}>
                <KeywordInput
                    fullWidth
                    label="מילת מפתח חדשה"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                    disabled={loading}
                >
                    הוסף
                </Button>
            </Box>

            <KeywordsContainer>
                {keywords.length > 0 ? (
                    <List>
                        {keywords.map((keyword, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={keyword} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDeleteKeyword(index)}
                                        disabled={loading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography color="textSecondary" align="center">
                        אין מילות מפתח. הוסף מילות מפתח כדי להתחיל לזהות לידים פוטנציאליים.
                    </Typography>
                )}
            </KeywordsContainer>
        </Container>
    );
};

export default KeywordsManager; 