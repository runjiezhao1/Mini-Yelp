import React from 'react';
import { HiMinusSmall,HiMiniArrowSmallDown,HiMiniEyeSlash   } from "react-icons/hi2";
import { Table,TableSortLabel, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import "../styles/resultPage.css"

function compareNames(a,b){
    if(a.name.localeCompare(b.name) > 0){
        return 1;
    }
    if(a.name.localeCompare(b.name) < 0){
        return -1;
    }
    return 0;
}

function compareStars(a,b){
    if(a.stars - (b.stars) > 0){
        return 1;
    }
    if(a.stars - (b.stars) < 0){
        return -1;
    }
    return 0;
}

function compareState(a,b){
    if(a.state.localeCompare(b.state) > 0){
        return 1;
    }
    if(a.state.localeCompare(b.state) < 0){
        return -1;
    }
    return 0;
}

export default function ResultPage(){
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [activeList, setActiveList] = React.useState(["true","false","false","false","false"]);
    const [nameOrder, setNameOrder] = React.useState(true);
    const [nameCompoenent,setNameComponent] = React.useState(true);
    const [starOrder, setStarOrder] = React.useState(true);
    const [orderCompoenent,setOrderComponent] = React.useState(false);
    const [stateOrder, setStateOrder] = React.useState(true);
    const [stateCompoenent,setStateComponent] = React.useState(false);

    const location = useLocation();
    let data = location.state.jsonData;
    const [input, setInput] = React.useState(data);

    let navigate = useNavigate();

    const displayData = (x) => {
        navigate(`/business/${x.business_id}`);
    }

    const onPageChanged = (event, newPage) => {
        setPage(newPage);
    };

    const onRowsPerPageChanged = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onNameOrderClicked = (id) => {
        if(nameOrder){
            data.sort((a,b)=>compareNames(b,a));
        }else{
            data.sort((a,b)=>compareNames(a,b));
        }
        let temp = !nameOrder;
        setNameOrder(temp);
        setOrderComponent(false);
        setNameComponent(true);
        setStateComponent(false);
        setPage(0);
    };

    const onStarOrderClicked = () => {
        if(starOrder){
            data.sort((a,b)=>compareStars(b,a));
        }else{
            data.sort((a,b)=>compareStars(a,b));
        }
        let temp = !starOrder;
        setStarOrder(temp);
        setOrderComponent(true);
        setNameComponent(false);
        setStateComponent(false);
        setPage(0);
    };

    const onStateOrderClicked = () => {
        if(stateOrder){
            data.sort((a,b)=>compareState(b,a));
        }else{
            data.sort((a,b)=>compareState(a,b));
        }
        let temp = !stateOrder;
        setStateOrder(temp);
        setStateComponent(true);
        setOrderComponent(false);
        setNameComponent(false);
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer>
                <TableHead>
                    <TableRow>
                        <TableCell key='Business Name'><TableSortLabel active={"true"} direction={(nameOrder ?"asc":"desc")} IconComponent={nameCompoenent?HiMiniArrowSmallDown:HiMiniEyeSlash} onClick={()=>onNameOrderClicked(0)}/>Business Name</TableCell>
                        <TableCell key='Address'>Address</TableCell>
                        <TableCell key='Categories'>Categories</TableCell>
                        <TableCell key='Stars'><TableSortLabel active={"true"} direction={(starOrder ? "asc":"desc")} IconComponent={orderCompoenent?HiMiniArrowSmallDown:HiMiniEyeSlash} onClick={()=>onStarOrderClicked()}/>Stars</TableCell>
                        <TableCell key='Open'>Openness</TableCell>
                        <TableCell key='State'><TableSortLabel active={"true"} direction={(stateOrder ? "asc":"desc")} IconComponent={stateCompoenent?HiMiniArrowSmallDown:HiMiniEyeSlash} onClick={()=>onStateOrderClicked()}/>State</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        input.slice(page*rowsPerPage,(page*rowsPerPage+rowsPerPage > data.length ? data.length : page*rowsPerPage+rowsPerPage)).map(x => <TableRow onClick={()=>displayData(x)}>
                        <TableCell key='Business Name'>
                            {x.name}
                        </TableCell>
                        <TableCell key='Address'>
                            {x.address}
                        </TableCell>
                        <TableCell key='Categories'>
                            {x.categories}
                        </TableCell>
                        <TableCell key='Stars'>
                            {x.stars}
                        </TableCell>
                        <TableCell key='Stars'>
                            {x.is_open.data[0] == 1 ? "Open" : "Closed"}
                        </TableCell>
                        <TableCell key='State'>
                            {x.state}
                        </TableCell>
                    </TableRow>)
                    }
                </TableBody>
            </TableContainer>
            <TablePagination class="SwitchPlace"
                rowsPerPageOptions={[5,10,15]}
                component="div"
                rowsPerPage={rowsPerPage}
                count={data.length}
                page={page}
                onPageChange={onPageChanged}
                onRowsPerPageChange={onRowsPerPageChanged}
          />
        </Box>
            
    );
}

//business name, address, rating, stars, is open, state, category