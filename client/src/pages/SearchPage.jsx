import React from 'react';

import { Box, Container, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

import Search from '../component/SearchBar';
import RecentActivities from '../component/RecentActivities';
import InfluentialUser from '../component/InfluentialUser';

export default function SearchPage() {
    return (
        <Container>
            <Box sx={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Search />
            </Box>

            <Box sx={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h4" sx={{color: blueGrey[800], textAlign: 'center', marginTop: '1rem', marginBottom: '2rem'}}>
                    Recent Activities
                </Typography>
                <RecentActivities />
            </Box>

            <Box sx={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h4" sx={{color: blueGrey[800], textAlign: 'center', marginTop: '1rem', marginBottom: '2rem'}}>
                    Influential User
                </Typography>
                <InfluentialUser />
            </Box>
        </Container>
    );
}