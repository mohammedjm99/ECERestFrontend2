import Cookies from 'js-cookie';
import { request } from '../../api/axiosMethods';
import './Left.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const Order = ({ order, orders, setOrders, socket }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const handleContol = async ({ id, status }) => {
        try {
            const token = Cookies.get('token');
            setLoading(true);
            setError(false)
            const res = await request.put('/order/chef', { id, status, msg }, {
                headers: { token: 'Bearer ' + token }
            });
            socket.emit('changeStatus', res.data);
            setMsg('');
            const updatedOrders = orders.filter(order => {
                if (order._id === id) order.status = status;
                return order.status < 2;
            });
            setOrders(updatedOrders);
            setLoading(false);
        } catch (e) {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setError(true);
            setLoading(false);
        }
    }
    return (
        <div className="order">
            {order.table.number === 0 ? <h2>Outside</h2>
                : <h2>Table <span style={{ color: '#f54749' }}>#{order.table.number}</span></h2>}

            {order.products.map((el, i) => (
                <div className="food" key={i}><p>{el.name}<span>x{el.quantity}</span></p><hr /></div>
            ))}

            {order.status === 0 ?
                <div className="buttons">
                    <button style={{ color: '#007E33', borderColor: '#007E33' }} onClick={() => handleContol({ id: order._id, status: 1 })}>Accept</button>
                    <button style={{ color: '#FF5733', borderColor: '#FF5733' }} onClick={() => handleContol({ id: order._id, status: 3 })}>Reject</button>
                    {loading && <CircularProgress style={{ height: '25px', width: '25px', margin: '5px 0' }} />}
                </div>
                :
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button style={{ color: '#0099CC', borderColor: '#0099CC' }} onClick={() => handleContol({ id: order._id, status: 2 })}>Complete</button>
                    {loading && <CircularProgress style={{ height: '25px', width: '25px', margin: '5px 0' }}/>}
                </div>
            }

            <input type="text" onChange={(e) => setMsg(e.target.value)} placeholder='Leave a msg...' />

            {error && <div className='error'>
                <div className="errorwrapper">
                    <div className="close">
                        <CloseIcon onClick={()=>setError(false)}/>
                    </div>
                    <h3>Internal server error</h3>    
                </div>
            </div>}

        </div>
    )
}


const Left = ({ orders, setOrders, socket }) => {

    useEffect(() => {
        orders && socket.on("addOrder", data => {
            setOrders(p => [...p, data])
        });
    }, []);
    return (
        <div className='left'>
            <div className="logo">
                <h1>Orders</h1>
                <p>Management</p>
            </div>

            {orders && (orders.length === 0 ? <p style={{ textAlign: 'center', marginTop: '20px' }}>There are no orders...</p>
                : <div className="orders">
                    {orders.map(order => (
                        <Order order={order} orders={orders} setOrders={setOrders} socket={socket} key={order._id} />
                    ))}
                </div>)
            }
        </div>
    )
}

export default Left