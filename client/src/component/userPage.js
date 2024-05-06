import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

function formatDate(isoString) {
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function UserReviewsPage() {
    const { user_id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [reviews, setReviews] = useState([]);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) - 1 || 0); 
    const [userName, setUserName] = useState('');
    const [userYelpSince, setYelpSince] = useState('');
    const [userAvgStars, setAvgStars] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams({
            page: page + 1,  
            [sortField]: sortOrder,
            limit: 10  // Always fetch 10 rows
        }).toString();

        fetch(`http://localhost:8080/user_review/${user_id}?${queryParams}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setReviews(data.data);
                if (data.data.length > 0) {
                    setUserName(data.data[0].name); 
                    setYelpSince(data.data[0].yelping_since);
                    setAvgStars(data.data[0].average_stars);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [user_id, page, sortField, sortOrder]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setSearchParams({ page: newPage + 1, sortField, sortOrder });
    };

    return (
        <div>
            <h1>{userName}</h1>
            <p>{`Yelping Since: ${userYelpSince}`}</p>
            <p>{`Average Stars: ${userAvgStars}`}</p>
            <div>
                <label>Sort by:</label>
                <select value={sortField} onChange={e => setSortField(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="likes">Likes</option>
                </select>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>
            </div>
            {reviews.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '70%' }}>Review</TableCell>
                                <TableCell style={{ width: '20%' }}>Date</TableCell>
                                <TableCell style={{ width: '10%' }}>Likes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.tip_id}>
                                    <TableCell>{review.text}</TableCell>
                                    <TableCell>{formatDate(review.date)}</TableCell>
                                    <TableCell>{review.likes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={-1}  
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={10}  
                        rowsPerPageOptions={[]}  
                    />
                </TableContainer>
            ) : <p>No reviews found.</p>}
        </div>
    );
}
