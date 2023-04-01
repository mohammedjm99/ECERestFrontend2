import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {request} from '../api/axiosMethods';
import Cookies from "js-cookie";
import CircularProgress from '@mui/material/CircularProgress';
import {Outlet} from 'react-router-dom';

export const Requirechief = ({children})=>{
    const [showChief,setShowChief] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');
    // console.log('require chief')
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

export const Requireadmin = ()=>{
    const [showAdmin,setShowAmin] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');
    // console.log('require admin')
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