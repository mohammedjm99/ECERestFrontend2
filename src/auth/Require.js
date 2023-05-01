import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CircularProgress from '@mui/material/CircularProgress';
import { Outlet } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar/Navbar";
import Cashiernavbar from '../components/Cashiernavbar/Cashiernavbar'


export const Requirechief = ({ children, socket }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [showCashier, setshowCashier] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'cashier') {
                navigate('/orders/inprogress');
                return;
            }
            socket.emit("joinChief", decoded._id);
            setshowCashier(true);
        } catch (e) {
            Cookies.remove('token');
            navigate('/login');
        }

        return()=>{
            socket.disconnect();
        }
    }, []);
    return (
        showCashier ? children : <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
    )
}

export const Requirecashier = ({ socket, navbarIndex }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [requireCashier, setRequireCashier] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'chief') {
                navigate('/chef');
                return;
            }
            socket.emit("joinCashier", decoded._id);
            setRequireCashier(true);
        } catch (e) {
            Cookies.remove('token');
            navigate('/login');
        }

        return()=>{
            socket.disconnect();
        }
    }, []);
    return (
        requireCashier ? <div style={{ display: 'flex',flexDirection:'column' }}><Cashiernavbar navbarIndex={navbarIndex} /><Outlet /></div> : <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
    )
}

export const Requireadmin = ({ socket, navbarIndex }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [requireCashier, setrequireCashier] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'chef') {
                navigate('/chief');
                return;
            } else if (decoded.rule === 'cashier') {
                navigate('cashier/orders/inprogress');
                return;
            }
            socket.emit("joinAdmin", decoded._id);
            setrequireCashier(true);
        } catch (e) {
            Cookies.remove('token');
            navigate('/login');
        }

        return()=>{
            socket.disconnect();
        }
    }, []);
    return (
        requireCashier ? <div style={{ display: 'flex' }}><Navbar navbarIndex={navbarIndex} /><Outlet /></div> : <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
    )
}