import React from 'react';
import { Avatar, Card, CardContent, CardHeader, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { green } from '@mui/material/colors';

export default function ActivityCard(props) {
    const {userName, businessName, text, date} = props; 

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader 
                avatar={ <Avatar aria-label="user-profile" sx={{bgcolor: green[400]}}>{userName.charAt(0).toUpperCase()}</Avatar> }
                title={userName}
                subheader={date}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {businessName}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: 5 }}>
                    {text}
                </Typography>
            </CardContent>

            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
                
        </Card>
    )
}