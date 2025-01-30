import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import AnalyticsWidget from './AnalyticsWidget';
import KeywordsManager from './KeywordsManager';
import BusinessInfoForm from './BusinessInfoForm';
import LeadsList from './LeadsList';
import FacebookConnect from './FacebookConnect';
import GroupScanner from './GroupScanner';
import PostScanner from './PostScanner';
import TemplatesManager from './TemplatesManager';
import { styled } from '@mui/material/styles';
import { fadeIn, slideUp } from '../animations';

const DashboardContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    animation: `${fadeIn} 0.5s ease-out`
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    animation: `${slideUp} 0.5s ease-out`,
    '&:hover': {
        transform: 'translateY(-2px)',
        transition: 'transform 0.3s ease'
    }
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    fontWeight: 600,
    animation: `${slideUp} 0.5s ease-out`
}));

const Dashboard = () => {
    const [analytics, setAnalytics] = useState({
        groupsScanned: 0,
        postsScanned: 0,
        potentialLeads: 0,
        commentsPosted: 0,
        messagesSent: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    return (
        <DashboardContainer maxWidth="lg">
            <PageTitle variant="h4" component="h1">
                דשבורד ניהול לידים
            </PageTitle>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DashboardPaper elevation={0}>
                        <FacebookConnect />
                    </DashboardPaper>
                </Grid>
                
                <Grid item xs={12}>
                    <GroupScanner />
                </Grid>
                
                <Grid item xs={12}>
                    <PostScanner />
                </Grid>
                
                <Grid item xs={12}>
                    <Paper>
                        <AnalyticsWidget data={analytics} />
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper>
                        <BusinessInfoForm />
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper>
                        <KeywordsManager />
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <TemplatesManager />
                </Grid>
                
                <Grid item xs={12}>
                    <Paper>
                        <LeadsList />
                    </Paper>
                </Grid>
            </Grid>
        </DashboardContainer>
    );
};

export default Dashboard; 