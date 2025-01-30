import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Message as MessageIcon,
    Comment as CommentIcon,
    Facebook as FacebookIcon,
    Delete as DeleteIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import CommentDialog from './CommentDialog';
import MessageDialog from './MessageDialog';
import HistoryDialog from './HistoryDialog';
import { styled } from '@mui/material/styles';
import { slideIn, fadeIn } from '../animations';

const LeadsTable = styled(TableContainer)(({ theme }) => ({
    '& .MuiTableCell-root': {
        padding: theme.spacing(2)
    },
    '& .MuiTableRow-root:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'translateX(-4px)',
        transition: 'all 0.3s ease'
    },
    animation: `${fadeIn} 0.5s ease-out`
}));

const TableRowAnimated = styled(TableRow)(({ theme, index }) => ({
    animation: `${slideIn} 0.5s ease-out`,
    animationDelay: `${index * 0.05}s`,
    animationFillMode: 'backwards'
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const colors = {
        'חדש': theme.palette.info.main,
        'בטיפול': theme.palette.warning.main,
        'נשלחה הודעה': theme.palette.success.main,
        'נכשל': theme.palette.error.main,
        'הושלם': theme.palette.success.dark
    };

    return {
        backgroundColor: colors[status] || theme.palette.grey[500],
        color: theme.palette.common.white
    };
});

const Container = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const LeadsList = () => {
    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [dialogType, setDialogType] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/leads');
                const data = await response.json();
                
                if (response.ok) {
                    setLeads(data.leads || []);
                } else {
                    throw new Error(data.message || 'אירעה שגיאה בטעינת הלידים');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (lead, type) => {
        setSelectedLead(lead);
        setDialogType(type);
    };

    const handleCloseDialog = () => {
        setSelectedLead(null);
        setDialogType(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!leads || leads.length === 0) {
        return (
            <Box p={3}>
                <Typography color="textSecondary">
                    אין לידים להצגה
                </Typography>
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                לידים פוטנציאליים
            </Typography>

            <LeadsTable component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>שם</TableCell>
                            <TableCell>מקור</TableCell>
                            <TableCell>תאריך</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell>{lead.name}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>
                                    {new Date(lead.date).toLocaleDateString('he-IL')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="שורות בעמוד:"
                    labelDisplayedRows={({ from, to }) => `${from}-${to}`}
                />
            </LeadsTable>
            
            {selectedLead && dialogType === 'message' && (
                <MessageDialog
                    lead={selectedLead}
                    open={true}
                    onClose={handleCloseDialog}
                />
            )}
            
            {selectedLead && dialogType === 'comment' && (
                <CommentDialog
                    lead={selectedLead}
                    open={true}
                    onClose={handleCloseDialog}
                />
            )}
            
            {selectedLead && dialogType === 'history' && (
                <HistoryDialog
                    lead={selectedLead}
                    open={true}
                    onClose={handleCloseDialog}
                />
            )}
        </Container>
    );
};

export default LeadsList; 