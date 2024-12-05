import React from 'react';
import { Box, Typography, Switch, FormGroup, FormControlLabel, Divider } from '@mui/material';

const Settings = () => {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications(event.target.checked);
    };

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={notifications} onChange={handleNotificationChange} />}
                    label="Enable Notifications"
                />
                <FormControlLabel
                    control={<Switch checked={darkMode} onChange={handleDarkModeChange} />}
                    label="Dark Mode"
                />
            </FormGroup>
        </Box>
    );
};

export default Settings;