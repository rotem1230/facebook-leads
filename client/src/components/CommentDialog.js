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

const PostInfo = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing(3)
}));

const CommentDialog = ({ lead, open, onClose }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates/comments', {
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
            let personalizedComment = template.content;
            // החלפת משתנים דינמיים
            personalizedComment = personalizedComment
                .replace('{שם}', lead.authorName || '')
                .replace('{תוכן}', lead.content || '')
                .replace('{קבוצה}', lead.groupName || '');
            
            setSelectedTemplate(templateId);
            setComment(personalizedComment);
        }
    };

    const handleSendComment = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`/api/leads/${lead.id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ comment })
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
                הגב לפוסט של {lead.authorName}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        התגובה נשלחה בהצלחה
                    </Alert>
                )}

                <PostInfo>
                    <Typography variant="subtitle2" gutterBottom>
                        פרטי הפוסט:
                    </Typography>
                    <Typography variant="body2">
                        <strong>מאת:</strong> {lead.authorName}
                    </Typography>
                    <Typography variant="body2">
                        <strong>קבוצה:</strong> {lead.groupName}
                    </Typography>
                    <Typography variant="body2">
                        <strong>תוכן:</strong> {lead.content}
                    </Typography>
                </PostInfo>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>בחר תבנית תגובה</InputLabel>
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
                    label="תוכן התגובה"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
                    onClick={handleSendComment}
                    disabled={loading || !comment.trim()}
                >
                    {loading ? <CircularProgress size={24} /> : 'שלח תגובה'}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default CommentDialog; 