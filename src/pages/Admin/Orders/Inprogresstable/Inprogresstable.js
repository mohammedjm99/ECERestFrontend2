import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../../../../api/axiosMethods';
import './Inprogresstable.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';


const Inprogresstable = ({ setNavbarIndex }) => {
    const [loading, setLoading] = useState(false);
    const [handleLoading, setHandleLoading] = useState(false);
    const [handleError, setHandleError] = useState(false);
    const [error, setError] = useState(false);
    const [orders, setOrders] = useState(null);
    const [tableNumber,setTableNumber] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        setNavbarIndex(2);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/order/inprogress/' + id,{signal});
                setOrders(res.data.orders);
                setTableNumber(res.data.tableNumber);
                setLoading(false);
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        }
        fetch();

        return () => {
            controller.abort();
        };
    }, []);

    const handleButton = (id) => {
        try {
            const fetch = async () => {
                try {
                    setHandleLoading(true);
                    setHandleError(false);
                    await request.post('/order/admin/inprogress/' + id);
                    const newOrders = orders.filter(order => order._id !== id);
                    setOrders(newOrders);
                    setHandleLoading(false);
                } catch (e) {
                    setHandleError(true);
                    setHandleLoading(false);
                }
            }
            fetch();
        } catch (e) {
            console.log(e);
        }
    }

    console.log(orders);
    return (
        <div className="inprogresstable">
            <h1 className='t'>orders in progress</h1>
            <div className="n">
                <div className="arrow" onClick={() => navigate('/admin/orders/inprogress')}><ArrowBackIosNewIcon /></div>
                <p>Table Number {tableNumber}</p>
            </div>

            {loading ? <div className="loading"><CircularProgress /></div> : orders && (orders.length === 0 ?
                <p className='empty'>No Orders</p>
                :
                <div className="orders">
                    {orders.map(order => (
                        <div className="order" key={order._id}>
                            {order.status === 0 ? <h2 className="status" style={{ color: '#F29339' }}>pending</h2> :
                                order.status === 1 ? <h2 className="status" style={{ color: '#007E33' }}>accepted</h2> :
                                    order.status === 2 ? <h2 className="status" style={{ color: '#0099CC' }}>completed</h2> :
                                        order.status === 3 ? <h2 className="status" style={{ color: '#FF5733' }}>rejected</h2> :
                                            ''}

                            {order.msg && <p style={{ color: '#a0a0a0' }}>Msg: {order.msg}</p>}

                            {order.products.map((el,i) => (
                                <div className="food" key={i}><p>{el.name} <span>${el.price}</span></p> <p>x{el.quantity}</p><hr /></div>
                            ))}

                            <div className="bottom">
                                <div className="total">Total: <span>${order.products.reduce((a, b) => a + b.price * b.quantity, 0)}</span></div>
                                {order.status === 2 ?
                                    <button disabled={handleLoading}
                                        onClick={() => handleButton(order._id)}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#0099CC'; e.target.style.color = '#fff'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = 'initial'; e.target.style.color = '#0099CC'; }}
                                        style={{ color: '#0099CC', borderColor: '#0099CC' }}>paid</button> :
                                    order.status === 3 ?
                                        <button disabled={handleLoading}
                                            onClick={() => handleButton(order._id)}
                                            onMouseOver={(e) => { e.target.style.backgroundColor = '#FF5733'; e.target.style.color = '#fff'; }}
                                            onMouseOut={(e) => { e.target.style.backgroundColor = 'initial'; e.target.style.color = '#FF5733'; }}
                                            style={{ color: '#FF5733', borderColor: '#FF5733' }}>checked</button> :
                                        ''}
                            </div>
                        </div>
                    ))}
                </div>)}
        </div>
    )
}

export default Inprogresstable;