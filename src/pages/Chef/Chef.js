import './Chef.scss';
import Cookies from 'js-cookie';
import Left from '../../components/Left/Left';
import Right from '../../components/Right/Right';
import { useEffect, useState } from 'react';
import { request } from '../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Chef = ({ socket }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token') || null;
    const [orders, setOrders] = useState(null);
    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await request.get('/order/chef', {
                    headers: { token: 'Bearer ' + token }
                });
                setOrders(res.data.orders);
                setTables(res.data.tables);
                setLoading(false);
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) {
                    Cookies.remove('token');
                    navigate('/login');
                    socket.disconnect();
                    return;
                }
                setLoading(false);
                setError("error");
            }
        }
        fetch();
    }, [token]);


    const handleLogout = ()=>{
        Cookies.remove('token');
        navigate('/login');
    }
    return (
        <div className="chef">
            {loading ? <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div> :
                <>
                    <Left orders={orders} setOrders={setOrders} socket={socket} />
                    <Right tables={tables} />
                    <div className='logout' onClick={handleLogout}>Logout</div>
                </>
            }
        </div>
    )
}

export default Chef