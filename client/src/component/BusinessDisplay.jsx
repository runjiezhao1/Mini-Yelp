import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function BusinessDisplay({data}){
    const navigate = useNavigate();

    return <div className="BusinessDisplay">
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell key='Business Name'>Business Name</TableCell>
                        <TableCell key='Address'>Address</TableCell>
                        <TableCell key='Categories'>Categories</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {   
                        data.map(x => <TableRow onClick={() => navigate(`/business/${x.business_id}`)}>
                            <TableCell key='Business Name'>
                                {x.name}
                            </TableCell>
                            <TableCell key='Address'>
                                {x.address}
                            </TableCell>
                            <TableCell key='Categories'>
                                {x.categories}
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <TableBody>
            {}
        </TableBody>
    </div>
}