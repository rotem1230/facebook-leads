import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
    Group as GroupIcon,
    Description as PostIcon,
    Person as LeadIcon,
    Comment as CommentIcon,
    Message as MessageIcon 
} from '@mui/icons-material';

const AnalyticItem = ({ icon, title, value }) => (
    <Paper sx={{ p: 2, height: '100%' }}>
        <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
            {icon}
            <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
                {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {value}
            </Typography>
        </Box>
    </Paper>
);

const AnalyticsWidget = ({ data }) => {
    const analytics = [
        {
            icon: <GroupIcon fontSize="large" color="primary" />,
            title: "קבוצות שנסרקו",
            value: data.groupsScanned
        },
        {
            icon: <PostIcon fontSize="large" color="primary" />,
            title: "פוסטים שנסרקו",
            value: data.postsScanned
        },
        {
            icon: <LeadIcon fontSize="large" color="primary" />,
            title: "לידים פוטנציאליים",
            value: data.potentialLeads
        },
        {
            icon: <CommentIcon fontSize="large" color="primary" />,
            title: "תגובות שפורסמו",
            value: data.commentsPosted
        },
        {
            icon: <MessageIcon fontSize="large" color="primary" />,
            title: "הודעות שנשלחו",
            value: data.messagesSent
        }
    ];

    return (
        <Box p={3}>
            <Typography variant="h5" component="h2" gutterBottom>
                סטטיסטיקות מערכת
            </Typography>
            <Grid container spacing={3}>
                {analytics.map((item, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <AnalyticItem {...item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AnalyticsWidget; 