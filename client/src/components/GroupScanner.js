import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Paper,
    TextField
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Search as SearchIcon, Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
}));

const GroupScanner = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const [url, setUrl] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/facebook/groups', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setGroups(data.groups);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScanGroup = async (groupId) => {
        setScanning(true);
        setError('');

        try {
            const response = await fetch(`/api/facebook/groups/${groupId}/scan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // עדכון הקבוצה ברשימה
            setGroups(groups.map(group => 
                group.id === groupId 
                    ? { ...group, lastScanned: new Date().toISOString() }
                    : group
            ));
        } catch (error) {
            setError(error.message);
        } finally {
            setScanning(false);
        }
    };

    const handleRemoveGroup = async (groupId) => {
        try {
            const response = await fetch(`/api/facebook/groups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setGroups(groups.filter(group => group.id !== groupId));
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleToggleAutoScan = async (groupId) => {
        try {
            const group = groups.find(g => g.id === groupId);
            const response = await fetch(`/api/facebook/groups/${groupId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    autoScan: !group.autoScan
                })
            });

            if (response.ok) {
                setGroups(groups.map(g => 
                    g.id === groupId 
                        ? { ...g, autoScan: !g.autoScan }
                        : g
                ));
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleScan = async () => {
        if (!url.trim()) {
            setError('נא להזין כתובת קבוצה');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // כאן יהיה הקוד לסריקת הקבוצה
            const dummyResults = [
                { id: 1, content: 'פוסט לדוגמה 1' },
                { id: 2, content: 'פוסט לדוגמה 2' }
            ];
            setResults(dummyResults);
        } catch (error) {
            setError('אירעה שגיאה בסריקת הקבוצה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <Typography variant="h6">
                    קבוצות מנוטרות
                </Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchGroups}
                    disabled={loading}
                >
                    רענן רשימה
                </Button>
            </Header>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box display="flex" gap={1} mb={2}>
                <TextField
                    fullWidth
                    label="כתובת URL של הקבוצה"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    onClick={handleScan}
                    disabled={loading}
                >
                    סרוק
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {results.length > 0 && (
                        results.map((result) => (
                            <ListItem key={result.id}>
                                <ListItemText primary={result.content} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end">
                                        <SaveIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    )}
                </List>
            )}
        </Container>
    );
};

export default GroupScanner; 