import React from "react";
import { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, CircularProgress, Box } from '@mui/material';

export default function ReviewList(props) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { business_id } = props;

  useEffect(() => {
    fetch(`http://localhost:8080/business_review/${business_id}?page=${page}`)
      .then(res => res.json())
      .then(res => {
        if (!res.data) return;
        setReviews(res.data);
        setIsLoading(false);
      });
  }, [page, business_id]);

  return (
    <TableContainer component={Paper}>
      <h2>Reviews</h2>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Text</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{review.text}</TableCell>
                <TableCell align="right">{new Date(review.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{review.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Box sx={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Button variant="contained" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={isLoading || page === 1}>
          Previous
        </Button>
        <Button variant="contained" onClick={() => setPage((prev) => prev + 1)} disabled={isLoading || reviews.length === 0}>
          Next
        </Button>
      </Box>
    </TableContainer>
  );
}
