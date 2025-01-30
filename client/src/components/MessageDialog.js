import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '100%',
        maxWidth: 600,
        padding: theme.spacing(2)
    }
}));

const RecipientInfo = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing(3)
}));

const TemplateSelect = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

const MessageField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8
    }
}));

const MessageDialog = ({ lead, open, onClose }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setTemplates(data.templates);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError('שגיאה בטעינת התבניות');
        }
    };

    const handleTemplateChange = (event) => {
        const templateId = event.target.value;
        const template = templates.find(t => t.id === templateId);
        if (template) {
            let personalizedMessage = template.content;
            // החלפת משתנים דינמיים
            personalizedMessage = personalizedMessage
                .replace('{שם}', lead.authorName || '')
                .replace('{תוכן}', lead.content || '')
                .replace('{קבוצה}', lead.groupName || '');
            
            setSelectedTemplate(templateId);
            setMessage(personalizedMessage);
        }
    };

    const handleSendMessage = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`/api/leads/${lead.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
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
        <StyledDialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>
                שליחת הודעה ל{lead.authorName}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        ההודעה נשלחה בהצלחה
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        פרטי הליד:
                    </Typography>
                    <Typography variant="body2">
                        <strong>שם:</strong> {lead.authorName}
                    </Typography>
                    <Typography variant="body2">
                        <strong>קבוצה:</strong> {lead.groupName}
                    </Typography>
                    <Typography variant="body2">
                        <strong>תוכן:</strong> {lead.content}
                    </Typography>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>בחר תבנית</InputLabel>
                    <Select
                        value={selectedTemplate}
                        onChange={handleTemplateChange}
                        disabled={loading}
                    >
                        {templates.map((template) => (
                            <MenuItem key={template.id} value={template.id}>
                                {template.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="תוכן ההודעה"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    dir="rtl"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    ביטול
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={loading || !message.trim()}
                >
                    {loading ? <CircularProgress size={24} /> : 'שלח'}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default MessageDialog; 