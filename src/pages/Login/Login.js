import { request } from '../../api/axiosMethods';
import './Login.scss';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const Login = ()=>{
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        if(token){
            try{
                const decodedToken = jwt_decode(token);
                decodedToken.rule==='chef' ? window.location.pathname='/chef' : decodedToken.rule==='/cashier' ? window.location.pathname='/cashier/orders/inprogress' : window.location.pathname='/dashboard';
            }catch(e){
                Cookies.remove('token');
            }
        }
    },[token,navigate])
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            // setError(null);
            setLoading(true);
            const res = await request.post('/manager/login',{
                username: e.target.username.value,
                password: e.target.password.value
            });
            const decodedToken = jwt_decode(res.data);
            Cookies.set('token',res.data,{expires:1});
            setLoading(false);
            decodedToken.rule==='chef' ? window.location.pathname='/chef' : decodedToken.rule==='/cashier' ? window.location.pathname='/cashier/orders/inprogress' : window.location.pathname='/dashboard';
        }catch(e){
            setLoading(false);
            setError(e.response.data);
        }
    }

    return(
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username..."/>
                <input type="password" name="password" placeholder="Password..."/>
                <button disabled={loading}>{loading && <CircularProgress color='inherit' style={{height:'20px',width:'20px'}}/>} Login</button>
            </form>
            <div className="error">{error}</div>
        </div>
    )
}

export default Login;