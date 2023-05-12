import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CircularProgress from '@mui/material/CircularProgress';
import { Outlet } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar/Navbar";
import Cashiernavbar from '../components/Cashiernavbar/Cashiernavbar'


export const Requirechef = ({ children, socket }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [showChef, setShowChef] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'cashier') {
                navigate('cashier/orders/inprogress');
                return;
            }
            socket.emit("joinChef", decoded._id);
            setShowChef(true);
        } catch (e) {
            Cookies.remove('token');
            navigate('/login');
        }

        return()=>{
            socket.disconnect();
        }
    }, []);
    return (
        showChef ? children : <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
    )
}

export const Requirecashier = ({ socket, navbarIndex }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [requireCashier, setRequireCashier] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'chef') {
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
    const [requireAdmin, setRequireAdmin] = useState(false);

    useEffect(() => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.rule === 'chef') {
                navigate('/chef');
                return;
            } else if (decoded.rule === 'cashier') {
                navigate('cashier/orders/inprogress');
                return;
            }
            if(window.location.pathname === '/') navigate('/dashboard');
            socket.emit("joinAdmin", decoded._id);
            setRequireAdmin(true);
        } catch (e) {
            Cookies.remove('token');
            navigate('/login');
        }

        return()=>{
            socket.disconnect();
        }
    }, []);
    return (
        requireAdmin ? <div style={{ display: 'flex' }}><Navbar navbarIndex={navbarIndex} /><Outlet /></div> : <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
    )
}