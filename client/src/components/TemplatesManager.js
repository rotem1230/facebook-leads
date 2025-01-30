import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
}));

const TemplateDialog = ({ open, onClose, template, onSave }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (template) {
            setName(template.name);
            setContent(template.content);
        } else {
            setName('');
            setContent('');
        }
    }, [template]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/templates${template ? `/${template.id}` : ''}`, {
                method: template ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name.trim(), content: content.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                onSave(data);
                onClose();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {template ? 'ערוך תבנית' : 'צור תבנית חדשה'}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="שם התבנית"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="תוכן התבנית"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    required
                    helperText="ניתן להשתמש במשתנים: {שם}, {תוכן}, {קבוצה}"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    ביטול
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim() || !content.trim()}
                >
                    {loading ? <CircularProgress size={24} /> : 'שמור'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TemplatesManager = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates');
            const data = await response.json();
            
            if (response.ok) {
                setTemplates(data.templates || []);
            } else {
                throw new Error(data.message || 'אירעה שגיאה בטעינת התבניות');
            }
        } catch (error) {
            setError(error.message);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/templates/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setTemplates(data.templates || []);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSave = (data) => {
        setTemplates(data.templates || []);
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
            <Header>
                <Typography variant="h6">
                    תבניות הודעה
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => {
                        setSelectedTemplate(null);
                        setDialogOpen(true);
                    }}
                >
                    צור תבנית
                </Button>
            </Header>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {templates && templates.length > 0 ? (
                <List>
                    {templates.map((template) => (
                        <ListItem key={template.id}>
                            <ListItemText 
                                primary={template.name}
                                secondary={template.content}
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => handleEdit(template)}
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => handleDelete(template.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography color="textSecondary" align="center">
                    אין תבניות. לחץ על 'צור תבנית' כדי להוסיף תבנית חדשה.
                </Typography>
            )}

            <TemplateDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                template={selectedTemplate}
                onSave={handleSave}
            />
        </Container>
    );
};

export default TemplatesManager; 