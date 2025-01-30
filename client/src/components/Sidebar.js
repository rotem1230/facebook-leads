import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Business as BusinessIcon,
    Group as GroupIcon,
    KeyboardReturn as KeyboardReturnIcon,
    Settings as SettingsIcon,
    Facebook as FacebookIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const StyledDrawer = styled(Drawer)({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH,
        boxSizing: 'border-box',
        top: 64,
        height: 'calc(100% - 64px)'
    }
});

const menuItems = [
    { text: 'חיבור לפייסבוק', icon: <FacebookIcon /> },
    { text: 'פרטי העסק', icon: <BusinessIcon /> },
    { text: 'סריקת קבוצות', icon: <GroupIcon /> },
    { text: 'ניהול תבניות', icon: <KeyboardReturnIcon /> },
    { text: 'הגדרות', icon: <SettingsIcon /> }
];

const Sidebar = () => {
    return (
        <StyledDrawer variant="permanent" anchor="right">
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </StyledDrawer>
    );
};

export default Sidebar; 