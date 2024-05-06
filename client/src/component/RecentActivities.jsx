import React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material'; 

import ActivityCard from './ActivityCard';

export default function RecentActivities() {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/recent_review')
            .then(res => res.json())
            .then(res => {
                if (!res.data) return;
                setActivities(res.data);
                setLoading(false);
            });
    }, [loading]);

    return (
        <>
            {loading ? (<CircularProgress />) : (
                <Grid container spacing={2}>
                    {activities.map((el, idx) => {
                        return (
                            <Grid item key={idx} xs={12} sm={6} md={4}>
                                <ActivityCard userName={el.UserName}
                                    businessName={el.BusinessName} text={el.text} date={el.date} />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </>
    )
}