import { request } from '../../api/axiosMethods';
import './Left.scss';
import { useEffect } from 'react';


const Left = ({ orders, setOrders, token}) => {
    const inputRefs = {};

    // useEffect(() => {
    //     socket.on("addOrder",data=>{
    //         setOrders(p=>[...p,data])
    //     })
    // }, []);

    const handleContol = async ({ id, status }) => {
        try {
            await request.put('/order/chief', { id, status, msg: inputRefs[id].value }, {
                headers: { token: 'Bearer ' + token }
            });
            inputRefs[id].value = "";
            const updatedOrders = orders.filter(order => {
                if (order._id === id) order.status = status;
                return order.status<2;
            })
            setOrders(updatedOrders);
        } catch (e) {
            console.log(e.response.data);
        }
    }
    return (
        <div className='left'>
            <div className="logo">
                <h1>Orders</h1>
                <p>Management</p>
            </div>

            {orders && orders.length !== 0 ?
                <div className="orders">
                    {orders.map(order=>(
                    <div className="order" key={order._id}>
                        <h2>Table <span style={{ color: '#f54749' }}>#{order.table.number}</span></h2>

                        {order.products.map((el,i) => (
                            <div className="food" key={i}><p>{el.name}<span>x{el.quantity}</span></p><hr /></div>
                        ))}

                        {order.status === 0 ?
                            <div className="buttons">
                                <button style={{ color: '#007E33', borderColor: '#007E33' }} onClick={() => handleContol({ id: order._id, status: 1 })}>Accept</button>
                                <button style={{ color: '#FF5733', borderColor: '#FF5733' }} onClick={() => handleContol({ id: order._id, status: 3 })}>Reject</button>
                            </div>
                            :
                            <button style={{ color: '#0099CC', borderColor: '#0099CC' }} onClick={() => handleContol({ id: order._id, status: 2 })}>Complete</button>}

                        <input type="text" ref={el => inputRefs[order._id] = el} placeholder='Leave a msg...' />

                    </div>
                    ))}
                </div>
                :
                <p style={{ textAlign: 'center', marginTop: '20px' }}>There are no orders...</p>
            }
        </div>
    )
}

export default Left