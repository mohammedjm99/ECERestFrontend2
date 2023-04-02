import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../../../api/axiosMethods';
import CircularProgress from '@mui/material/CircularProgress';
import './Inprogress.scss';

const Inprogress = ({ setNavbarIndex , socket}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [tablesWithOrders, setTablesWithOrders] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
        socket.on("addOrder",data=>{
            setTablesWithOrders(p => {
                const newState = {
                  ...p,
                  [data.table._id]: {
                    ...p[data.table._id],
                    amount: p[data.table._id].amount + 1,
                  },
                };
                return newState;
              });
              setTotal(p=>p+1);
        })
    }, []);

    useEffect(() => {
        setNavbarIndex(2);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/order/inprogress', { signal });
                setTablesWithOrders(res.data.arr);
                setTotal(res.data.total);
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
    }, [setNavbarIndex]);
    return (
        <div className="inprogress">
            <h1>orders in progress</h1>
            {loading ? <div className="loading"><CircularProgress /></div>
                :
                <div className='wrapper'>
                    <div className="orders">
                        {tablesWithOrders && Object.entries(tablesWithOrders).map(([obj, value]) => (
                            <Link key={obj} to={`/admin/orders/inprogress/${obj}`}>
                                <div className="order">
                                    <h2>Table <span>#{value.number}</span></h2>
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