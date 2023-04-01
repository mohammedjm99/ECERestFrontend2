import { useEffect, useState } from 'react';
import './Paid.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import * as React from 'react'
import { TablePagination } from '@mui/material';
import { request } from '../../../../api/axiosMethods';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                    {row.table.number}
                </TableCell>
                <TableCell align="center">{row.products.reduce((a,b)=>a+b.product.price*b.quantity,0)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Foods
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Price (per unit)</TableCell>
                                        <TableCell align="center">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products.map((el, i) => (
                                        <TableRow key={el.product._id}>
                                            <TableCell component="th" scope="row" align="center">{el.product.name}</TableCell>
                                            <TableCell align="center">{el.quantity}</TableCell>
                                            <TableCell align="center">{el.product.price}</TableCell>
                                            <TableCell align="center">{el.product.price * el.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Paid = ({ setNavbarIndex }) => {
    const [rows, setRows] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

    useEffect(() => {
        setNavbarIndex(3);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetch = async()=>{
            try{
                setLoading(true);
                setError(false);
                setPage(0);
                const res = await request.get(`/order/admin/paid/${selectedDate['$y']}-${selectedDate['$M'] + 1}-${selectedDate['$D']}`,{signal});
                setRows(res.data);
                setLoading(false);
            }catch(e){
                setError(true);
                setLoading(false);
            }
        }
        fetch();

        return () => {
            controller.abort();
        };
    }, [setNavbarIndex,selectedDate]);


    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const currentRows = rows && rows.filter((r, ind) => {
        return ind >= rowsPerPage * page && ind < rowsPerPage * (page + 1);
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    console.log(rows);

    return (
        <div className="paid">
            <h1 className='t'>Paid Orders</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="date">
                    <DatePicker value={selectedDate} onChange={handleDateChange} format="DD-MM-YYYY" />
                </div>
            </LocalizationProvider>

            {loading ? <div className='loading'><CircularProgress/></div> : rows && (rows.length===0 ? <p className='empty'>No Paid Orders At This Date</p> 
            : 
            <div className="table">
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="center">Table Number</TableCell>
                                <TableCell align="center">Order Price&nbsp;($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRows.map((row) => (
                                <Row key={row._id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </div>)}
        </div>
    )
}

export default Paid;