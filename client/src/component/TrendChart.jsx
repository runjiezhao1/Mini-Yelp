import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the components you need
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Now, you can use 'category' for xAxes and 'linear' for yAxes in your chart configuration


export default function TrendChart(props) {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { business_id } = props;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8080/rush_hour/${business_id}`);
                setChartData(mapDataToWeekHours(response.data.data));
            } catch (error) {
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [business_id]);  

    function mapDataToWeekHours(data) {
        const weekMap = {
            'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7
        };
    
        const weekHours = new Array(7 * 24).fill(0);
    
        data.forEach(item => {
            const dayIndex = weekMap[item.weekday] - 1;
            const hour = parseInt(item.hour.split(':')[0]);
            const index = dayIndex * 24 + hour;
            weekHours[index] += item.total_checkin;
        });
    
        return weekHours;
    }

    const labels = Array.from({ length: 168 }, (_, index) => index);
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Total Check-ins Per Hour of the Week',
                data: chartData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Check-ins'
                }
            },
            x:{
                type: 'category',
                labels: chartData.map((item, index) => {
                    const hour = index % 24;
                    const dayStartHours = [0, 24, 48, 72, 96, 120, 144, 168];
                    if (dayStartHours.includes(index)) {
                        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index / 24];
                    } else {
                        return '';  // This will make non-starting hour labels empty
                    }
                }),
                title: {
                    display: true,
                    text: 'Day of the Week'
                }
            }
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="div">
                    Rush Hour Trends
                </Typography>
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Line data={data} options={options} />
                )}
            </CardContent>
        </Card>
    );
}