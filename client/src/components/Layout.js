import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const LayoutRoot = styled(Box)({
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    width: '100%'
});

const LayoutContent = styled(Box)({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    paddingRight: 280 // רוחב הסייד-בר
});

const MainContent = styled(Box)({
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
    position: 'relative'
});

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <LayoutRoot>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        מערכת ניהול לידים
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <Sidebar />
            
            <LayoutContent>
                <MainContent>
                    <Container maxWidth="lg" sx={{ py: 3 }}>
                        {children}
                    </Container>
                </MainContent>
            </LayoutContent>
        </LayoutRoot>
    );
};

export default Layout; 