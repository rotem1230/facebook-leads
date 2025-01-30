import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import {
    Message as MessageIcon,
    Comment as CommentIcon,
    Error as ErrorIcon,
    CheckCircle as SuccessIcon
} from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '100%',
        maxWidth: 600,
        padding: theme.spacing(2)
    }
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2)
}));

const HistoryItem = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: 8,
    border: `1px solid ${theme.palette.grey[200]}`
}));

const HistoryDialog = ({ lead, open, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, [lead.id]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/leads/${lead.id}/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setHistory(data.history);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getIconByType = (type, status) => {
        if (status === 'נכשל') return <ErrorIcon color="error" />;
        if (status === 'הושלם') return <SuccessIcon color="success" />;
        
        switch (type) {
            case 'message':
                return <MessageIcon color="primary" />;
            case 'comment':
                return <CommentIcon color="secondary" />;
            default:
                return <TimelineDot />;
        }
    };

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>
                היסטוריית תקשורת עם {lead.authorName}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TimelineContainer>
                        {history.length === 0 ? (
                            <Typography color="textSecondary" align="center">
                                אין היסטוריית תקשורת
                            </Typography>
                        ) : (
                            <Timeline>
                                {history.map((item, index) => (
                                    <TimelineItem key={item.id}>
                                        <TimelineOppositeContent>
                                            <Typography variant="body2" color="textSecondary">
                                                {new Date(item.timestamp).toLocaleString('he-IL')}
                                            </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot>
                                                {getIconByType(item.type, item.status)}
                                            </TimelineDot>
                                            {index < history.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <HistoryItem>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    {item.type === 'message' ? 'הודעה פרטית' : 'תגובה לפוסט'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.content}
                                                </Typography>
                                                {item.error && (
                                                    <Typography variant="body2" color="error">
                                                        שגיאה: {item.error}
                                                    </Typography>
                                                )}
                                            </HistoryItem>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        )}
                    </TimelineContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    סגור
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default HistoryDialog; 