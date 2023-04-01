import { request } from '../../api/axiosMethods';
import './Login.scss';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Login = ()=>{
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        if(token){
            const decodedToken = jwt_decode(token);
            navigate('/'+decodedToken.rule);
        }
    },[token,navigate])
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            setError(null);
            setLoading(true);
            const res = await request.post('/manager/login',{
                username: e.target.username.value,
                password: e.target.password.value
            });
            const decodedToken = jwt_decode(res.data);
            Cookies.set('token',res.data,{expires:1});
            setLoading(false);
            navigate('/'+decodedToken.rule);
        }catch(e){
            setLoading(false);
            setError(e.message);
        }
    }

    return(
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username..."/>
                <input type="text" name="password" placeholder="Password..."/>
                <button>Login</button>
            </form>
            <div className="error">{error}</div>
        </div>
    )
}

export default Login;