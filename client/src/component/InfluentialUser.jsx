import React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { useNavigate } from "react-router-dom";
import { red } from '@mui/material/colors';

export default function InfluentialUser() {
    const [loading, setLoading] = useState(true);
    const [influentialUsers, setInfluentialUsers] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:8080/influential_user`)
            .then(response => response.json())
            .then(res => {
                if (!res.data) return;
                console.log(res);
                setInfluentialUsers(res.data);
                setLoading(false);
            })
    }, []);


    let navigate = useNavigate();

    const handleChangeOnCategory = (el) => {
        console.log(el);
        navigate(`/user/${el.user_id}`);
    }

    return (
        <>
            {loading ? (<CircularProgress />) : (
                <List variant="outlined" sx={{maxWidth: 240, boarderRadius: 'sm'}}>
                    {influentialUsers.map((el, idx) => {
                        return (
                            <ListItem key={idx}>
                                <ListItemDecorator>
                                    <Avatar size="small" onClick={()=>handleChangeOnCategory(el)} sx={{bgcolor: red[400]}}>{el.name.charAt(0).toUpperCase()}</Avatar>
                                </ListItemDecorator>
                                {/* {el.name} */}
                                <ListItemText primary={el.name} secondary={`Reviews: ${el.num_review}`} />
                            </ListItem>
                        );
                    })}
                </List>
            )}  
        </>
    )
}