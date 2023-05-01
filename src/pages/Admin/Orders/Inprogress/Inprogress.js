import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../../../../api/axiosMethods';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import './Inprogress.scss';

const Inprogress = ({ setNavbarIndex, socket }) => {

    const navigate = useNavigate();
    const [cashier, setCashier] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tablesWithOrders, setTablesWithOrders] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
        socket.on("addOrder", data => {
            setTablesWithOrders(p => {
                if(p){
                    const newState = {
                        ...p,
                        [data.table._id]: {
                            ...p[data.table._id],
                            amount: p[data.table._id].amount + 1,
                        },
                    };
                    return newState;
                }
            });
            setTotal(p => p + 1);
        });

        socket.on("removeOrder", data => {
            setTablesWithOrders(p => {
                if(p){
                    const newState = {
                        ...p,
                        [data.table]: {
                            ...p[data.table],
                            amount: p[data.table].amount-1,
                        },
                    };
                    return newState;
                }
            });
            setTotal(p => p - 1);
        });
    }, []);

    useEffect(() => {
        setNavbarIndex(2);
        const controller = new AbortController();
        const signal = controller.signal;
        const token = Cookies.get('token');
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/order/inprogress', {
                    signal, headers: {
                        token: 'Bearer ' + token
                    }
                });
                setTablesWithOrders(res.data.arr);
                setTotal(res.data.total);
                if (res.data.rule === 'cashier') {
                    setCashier(true);
                } else {
                    setCashier(false);
                }
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
    }, [setNavbarIndex]);
    return (
        <div className="inprogress">
            {!cashier && <h1>orders in progress</h1>}
            {loading ? <div className="loading"><CircularProgress /></div>
                :
                <div className='wrapper'>
                    <div className="orders">
                        {tablesWithOrders && Object.entries(tablesWithOrders).map(([obj, value]) => (
                            <Link key={obj} to={`${cashier ? `/cashier/orders/inprogress/${obj}` : `/orders/inprogress/${obj}`}`}>
                                <div className="order">
                                    {value.number === 0 ?
                                        <h2>Outside</h2>
                                        :
                                        <h2>Table <span>#{value.number}</span></h2>
                                    }
                                    <h3><span>{value.amount === 0 ? 'No' : value.amount}</span> Order{value.amount !== 1 && 's'}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {total !== null && <h2><span>Total:</span> {total === 0 ? 'No' : total} Order{total !== 1 && 's'}</h2>}
                </div>
            }
        </div>
    )
}

export default Inprogress;