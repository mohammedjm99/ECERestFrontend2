import './Chief.scss';
import Cookies from 'js-cookie';
import Left from '../../components/Left/Left';
import Right from '../../components/Right/Right';
import { useEffect, useState } from 'react';
import {request} from '../../api/axiosMethods';

const Chief = ()=>{
    const token = Cookies.get('token') || null;
    const [orders,setOrders] = useState(null);
    const [tables,setTables] = useState(null);
    useEffect(()=>{
        const fetch = async()=>{
            try{
                const res = await request.get('/order/chief',{
                    headers: {token: 'Bearer '+token}
                })
                setOrders(res.data.orders);
                setTables(res.data.tables);
            }catch(e){
                console.log(e.message);
            }
        }
        fetch();
    },[token]);
    return(
        <div className="chief">
            <Left orders={orders} setOrders={setOrders} token={token}/>
            <Right tables={tables}/>
        </div>
    )
}

export default Chief