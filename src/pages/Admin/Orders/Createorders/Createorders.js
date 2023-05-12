import { useEffect, useState } from 'react';
import './Createorders.scss';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { request } from '../../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const Createorders = ({ setNavbarIndex, socket }) => {
    const navigate = useNavigate();

    const [cashier,setCashier] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('all');

    const [products, setProducts] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [tables, setTables] = useState(null);
    const [table, setTable] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const [sError, setSError] = useState('');
    const [sLoading, setSLoading] = useState(false);
    const [sSuccess, setSSuccess] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        setNavbarIndex(1);
        setLoading(true);
        setError(false);
        const controller = new AbortController();
        const signal = controller.signal;
        request.get('/order/createorders', {
            signal, headers: {
                token: 'Bearer ' + token
            }
        }).then(res => {
            setLoading(false);
            setProducts(res.data.products);
            setFilteredProducts(res.data.products);
            setCategories(res.data.categories);
            if(res.data.rule==='cashier'){ 
                setCashier(true);
            }else{
                setCashier(false);
            }
            const tablesData = res.data.tables;
            setTables(tablesData);
            tablesData.length !== 0 && setTable(tablesData[0]._id);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setLoading(false);
            setError(true);
        });

        return () => {
            controller.abort();
        }
    }, [setNavbarIndex]);

    const handleAdd = (product) => {
        setOrders([...orders, { ...product, quantity: 1 }]);
    }

    const handleDelete = (id) => {
        setOrders(orders.filter(order => order._id !== id));
    }

    const handleControl = (payload) => {
        const index = orders.findIndex(order => order._id === payload.id);
        const newOrders = [...orders];
        if (payload.action === '+') {
            if (orders[index].quantity < 9) {
                newOrders[index].quantity++;
                setOrders(newOrders);
            }
        } else {
            if (orders[index].quantity === 1) {
                setOrders(orders.filter(order => order._id !== payload.id));
                return;
            }
            if (orders[index].quantity > 1) {
                newOrders[index].quantity--;
                setOrders(newOrders);
            }
        }
    }

    useEffect(() => {
        products && setFilteredProducts(category === "all"
            ? products.filter(product => product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
            : products.filter(product => product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 && product.category === category));
    }, [category, searchText]);

    const handleSubmit = () => {
        setSLoading(true);
        setSError('');
        const token = Cookies.get('token');
        const api = orders.map(item => {
            return {
                product: item._id,
                quantity: item.quantity
            }
        });
        request.post('/order/' + table, {
            products: api
        }, {
            headers: {
                token: 'Bearer ' + token
            }
        }).then(res => {
            socket.emit("addOrder", res.data);
            setSSuccess(true);
            setOrders([]);
            setSLoading(false);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setSError(e.response.data);
            setSSuccess(false);
            setSLoading(false);
        })
    }

    useEffect(() => {
        if (sSuccess) setTimeout(() => setSSuccess(false), 3000)
    }, [sSuccess])
    return (
        <div className="createorders">
            {!cashier && <h1>Create Orders</h1>}
            {loading ? <div className="loading"><CircularProgress /></div> :
                <div className="wrapper">
                    <div className="l">
                        <div className="filter">
                            <div className="searchcontainer">
                                <SearchIcon className='icon' />
                                <input type="text" placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                                <CloseIcon className='icon' onClick={() => setSearchText('')} style={{ cursor: 'pointer' }} />
                            </div>
                            <select defaultValue="all" onChange={(e) => setCategory(e.target.value)}>
                                <option value={'all'}>All</option>
                                {categories && categories.map((c, i) => (
                                    <option key={i} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        {filteredProducts && filteredProducts.length === 0 ?
                            <p className='empty'>No Products</p>
                            :
                            <div className="products">
                                {filteredProducts && filteredProducts.map(product => (
                                    <div className="product" key={product._id} style={product.isVisible?{opacity:1}:{opacity:0.7}}>
                                        <div className="img">
                                            <img src={product.img} alt="" />
                                        </div>
                                        <h2>{product.name}</h2>
                                        <div className="details">
                                            <h3>{product.category}</h3>
                                            <h3><span>$</span>{product.price}</h3>
                                        </div>
                                        {product.isVisible?
                                            orders.some(order => order._id === product._id) ? <button onClick={() => handleDelete(product._id)}>-Delete</button>
                                            : <button onClick={() => handleAdd(product)}>+Add</button>
                                        :
                                            <h4>Currently Unvailable</h4>
                                        }
                                    </div>
                                ))}
                            </div>
                        }

                    </div>
                    <div className="r">
                        <div className="in">
                            <h2>Order Details</h2>
                            <div className="select">
                                <p>order for:</p>
                                <select onChange={(e) => setTable(e.target.value)}>
                                    {tables && tables.map(t => (
                                        <option key={t._id} value={t._id}>{t.number === 0 ? 'outside restaurnt' : 'Table ' + t.number}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="items">
                                {orders.length === 0
                                    ? <p className="empty">no items added</p>
                                    : orders.map(item => (
                                        <div className='item' key={item._id}>
                                            <div className="img">
                                                <img src={item.img} alt="" />
                                            </div>
                                            <div className="content">
                                                <p>{item.name}</p>
                                                <p><span style={{ color: '#f54749', marginRight: '3px' }}>$</span>{item.price}</p>
                                            </div>
                                            <div className="quantity">
                                                <div className="control" onClick={() => handleControl({ action: '+', id: item._id })}>+</div>
                                                <p>{item.quantity}</p>
                                                <div className="control" onClick={() => handleControl({ action: '-', id: item._id })}>-</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {
                                <div className="total">
                                    <h3>Total: <span style={{ color: '#f54749' }}>$</span>{orders.reduce((a, b) => a + b.price * b.quantity, 0)}</h3>
                                </div>
                            }
                            <div className="buttons">
                                <button onClick={handleSubmit} disabled={sLoading || (orders && orders.length === 0)}>submit</button>
                                <button disabled={orders && orders.length === 0} onClick={() => setOrders([])}>clear</button>
                            </div>
                        </div>
                        {sError && <p style={{ marginTop: '10px', color: '#f54749', textAlign: 'center' }}>{sError}</p>}
                        {sSuccess && <p style={{ marginTop: '10px', color: 'rgb(0, 126, 51)', textAlign: 'center' }}>Order submitted successfully</p>}
                        {sLoading && <CircularProgress className='sloading' />}
                    </div>
                </div>
            }
        </div>
    )
}

export default Createorders;