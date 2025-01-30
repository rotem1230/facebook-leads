import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 12,
        padding: theme.spacing(2)
    }
}));

const DialogMessage = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmText = 'אישור',
    cancelText = 'ביטול',
    onConfirm,
    onCancel,
    confirmColor = 'primary'
}) => {
    return (
        <StyledDialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            
            <DialogContent>
                <DialogMessage>
                    {message}
                </DialogMessage>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={onConfirm}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default ConfirmDialog; 