import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {request} from '../api/axiosMethods';
import Cookies from "js-cookie";
import CircularProgress from '@mui/material/CircularProgress';
import {Outlet} from 'react-router-dom';
import jwtDecode from "jwt-decode";

export const Requirechief = ({children,socket})=>{
    const [showChief,setShowChief] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(()=>{
        if(showChief){
            try{
                const decoded = jwtDecode(token);
                socket.emit("joinChief",decoded._id);
            }catch(e){
    
            }
    
            return()=>{
                socket.disconnect();
            }
        }
    },[showChief])

    useEffect(()=>{
        const fetch = async()=>{
            try{
                await request.get('/auth/requirechief',{
                    headers: { token: `Bearer ${token}` }
                })
                setShowChief(true);
            }catch(e){
                Cookies.remove('token');
                setShowChief(false);
                navigate('/');
            }
        }
        fetch();
    },[token,navigate]);
    return(
        showChief ? children : <div style={{height:'100vh',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}><CircularProgress/></div>
    )
}

export const Requireadmin = ({socket})=>{
    const [showAdmin,setShowAmin] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(()=>{
        if(showAdmin){
            try{
                const decoded = jwtDecode(token);
                socket.emit("joinAdmin",decoded._id);
            }catch(e){
    
            }
    
            return()=>{
                socket.disconnect();
            }
        }
    },[showAdmin])

    useEffect(()=>{
        const fetch = async()=>{
            try{
                await request.get('/auth/requireadmin',{
                    headers: { token: `Bearer ${token}` }
                })
                setShowAmin(true);
            }catch(e){
                Cookies.remove('token');
                setShowAmin(false);
                navigate('/');
            }
        }
        fetch();
    },[token,navigate]);
    return(
        showAdmin ? <Outlet/> : <div style={{height:'100vh',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}><CircularProgress/></div>
    )
}