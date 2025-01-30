import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Layout from '../components/Layout';
import BusinessInfoForm from '../components/BusinessInfoForm';
import KeywordsManager from '../components/KeywordsManager';
import GroupScanner from '../components/GroupScanner';
import LeadsList from '../components/LeadsList';
import TemplatesManager from '../components/TemplatesManager';
import FacebookConnect from '../components/FacebookConnect';

const Dashboard = () => {
    const [isConnectedToFacebook, setIsConnectedToFacebook] = useState(false);
    const [businessInfo, setBusinessInfo] = useState(null);

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FacebookConnect 
                        isConnected={isConnectedToFacebook}
                        onConnect={() => setIsConnectedToFacebook(true)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BusinessInfoForm 
                        businessInfo={businessInfo}
                        onSave={setBusinessInfo}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <KeywordsManager />
                </Grid>

                <Grid item xs={12}>
                    <GroupScanner />
                </Grid>

                <Grid item xs={12}>
                    <LeadsList />
                </Grid>

                <Grid item xs={12}>
                    <TemplatesManager />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Dashboard; 