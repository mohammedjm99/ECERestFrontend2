import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../../../../api/axiosMethods';
import './Inprogresstable.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';

const Inprogresstable = ({ setNavbarIndex, socket }) => {
    const [loading, setLoading] = useState(true);
    const [handleLoading, setHandleLoading] = useState(false);
    const [handleError, setHandleError] = useState(false);
    const [error, setError] = useState(false);
    const [orders, setOrders] = useState(null);
    const [canEdit, setCanEdit] = useState(true);
    const [tableNumber, setTableNumber] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setNavbarIndex(2);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setLoading(true);
                setError(false);
                const res = await request.get('/order/inprogress/' + id, {
                    signal, headers: {
                        token: 'Bearer ' + token
                    }
                });
                setOrders(res.data.orders);
                setTableNumber(res.data.tableNumber);
                setCanEdit(res.data.canEdit);
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
        fetch();

        return () => {
            controller.abort();
        };
    }, []);

    const handleButton = ({id,table}) => {
        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setHandleLoading(true);
                setHandleError(false);
                await request.put('/order/admin/inprogress/' + id, {}, {
                    headers: {
                        token: 'Bearer ' + token
                    }
                });
                const newOrders = orders.filter(order => order._id !== id);
                socket.emit("removeOrder",{id,table});
                setOrders(newOrders);
                setHandleLoading(false);
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) {
                    Cookies.remove('token');
                    navigate('/login');
                    return;
                }
                setHandleError(true);
                setHandleLoading(false);
            }
        }
        fetch();
    }
    useEffect(() => {
        socket.on('changeStatus', data => {
            if (data.table._id === id) {
                setOrders(prevOrders => prevOrders && prevOrders.map(order => order._id === data._id ? data : order));
            }
        });
        socket.on("addOrder", data => {
            if (data.table._id === id) {
                setOrders(p => p && [...p, data]);
            }
        });
        socket.on('removeOrder', data => {
            try{
                if(id===data.table){
                    setOrders(prevOrders => prevOrders && prevOrders.filter(order => order._id !== data.id ));
                }
            }catch(e){
            }
        });
    }, []);
    return (
        <div className="inprogresstable">
            {!canEdit && <h1 className='t'>orders in progress</h1>}
            {handleError && <div className='error'>
                <div className="errorwrapper">
                    <div className="close">
                        <CloseIcon onClick={() => setHandleError(false)} />
                    </div>
                    <h3>Internal server error</h3>
                </div>
            </div>}
            {error && <h3 className='ee'>Internal server error</h3>}
            {!error && tableNumber!==null && <div className="n">
                <div className="arrow" onClick={() => navigate(`${canEdit ? '/cashier/orders/inprogress' : '/orders/inprogress/'}`)}><ArrowBackIosNewIcon /></div>
                {tableNumber === 0 ? <p>Outside</p>
                    :<p>Table Number {tableNumber}</p>}
            </div>}

            {loading ? <div className="loading"><CircularProgress /></div> : orders && (orders.length === 0 ?
                <p className='empty'>No Orders</p>
                :
                <div className="orders">
                    {orders && orders.map(order => (
                        <div className="order" key={order._id}>
                            {order.status === 0 ? <h2 className="status" style={{ color: '#F29339' }}>pending</h2> :
                                order.status === 1 ? <h2 className="status" style={{ color: '#007E33' }}>accepted</h2> :
                                    order.status === 2 ? <h2 className="status" style={{ color: '#0099CC' }}>completed</h2> :
                                        order.status === 3 ? <h2 className="status" style={{ color: '#FF5733' }}>rejected</h2> :
                                            ''}

                            {order.msg && <p style={{ color: '#a0a0a0' }}>Msg: {order.msg}</p>}

                            {order.products.map((el, i) => (
                                <div className="food" key={i}><p>{el.name} <span>${el.price}</span></p> <p>x{el.quantity}</p><hr /></div>
                            ))}

                            <div className="bottom">
                                <div className="total">Total: <span>${order.products.reduce((a, b) => a + b.price * b.quantity, 0)}</span></div>
                                {canEdit && order.status === 2 ?
                                    <button disabled={handleLoading}
                                        onClick={() => handleButton({id:order._id,table:order.table._id})}
                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#0099CC'; e.target.style.color = '#fff'; }}
                                        onMouseOut={(e) => { e.target.style.backgroundColor = 'initial'; e.target.style.color = '#0099CC'; }}
                                        style={{ color: '#0099CC', borderColor: '#0099CC' }}>paid</button> :
                                    canEdit && order.status === 3 ?
                                        <button disabled={handleLoading}
                                            onClick={() => handleButton({id:order._id,table:order.table._id})}
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