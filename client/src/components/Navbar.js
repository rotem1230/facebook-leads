import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - 240px)` },
                ml: { sm: `240px` }
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Facebook Leads Analyzer
                </Typography>
                <Button color="inherit" onClick={logout}>
                    התנתק
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 