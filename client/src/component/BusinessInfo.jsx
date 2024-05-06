import React from 'react';
import { useState, useEffect } from 'react';
import { Rating, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

import restaurant from '../images/restaurant.jpg';
import '../styles/BusinessInfoStyle.css';

export default function BusinessInfo(props) {
    const [category, setCategory] = useState('');
    const [stars, setStars] = useState(0);
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [is_open, setIsOpen] = useState(true);
    
    const { business_id } = props;

    useEffect(() => {
        function getFullAddress(data) {
            return `${data.address}, ${data.city}, ${data.state}`;
        }

        function getAllCategories(data) {
            let category = "";

            data.categories.split(", ").forEach((el) => {
                category += `•${el} `
            });
    
            return category;
        }

        fetch(`http://localhost:8080/business_id_search/${business_id}`)
            .then(res => res.json())
            .then(res => {
                setCategory(getAllCategories(res.data[0]));
                setStars(res.data[0].stars);
                setName(res.data[0].name);
                setAddress(getFullAddress(res.data[0]));
                setIsOpen(res.data[0].is_open.data[0] === 1);
        });
    });

    
    return (
            <div className="container business-info" style={{ 
                backgroundImage: `url(${restaurant})`
            }}>
                <div className="row mt-3 justify-content-center">
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <h1 className="business-name">{name}</h1>
                    </Box>
                </div>

                <div className="row mt-2 justify-content-center">
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Rating name="half-rating-read" value={stars} precision={0.5} readOnly
                            icon={<StarIcon style={{fontSize: 40}} fontSize="inherit" />}
                            emptyIcon={<StarIcon style={{fontSize: 40, opacity: 0.9, color: "black"}} fontSize="inherit" />}
                        />

                        <h2 className="rating-number">{stars}</h2>
                    </Box>

                </div>

                <div className='row mt-2 justify-content-center'>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h2 className="category">{category}</h2>
                    </Box>
                </div>

                <div className='row mt-2 justify-content-center'>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {is_open ? <h2 className='open'>OPEN</h2> : <h2 className='in-future'>OPEN IN FUTURE</h2> }
                        <h2 className="address" style={{marginLeft: 20}}>{address}</h2>
                    </Box>
                </div>
            
            </div>
         );
}