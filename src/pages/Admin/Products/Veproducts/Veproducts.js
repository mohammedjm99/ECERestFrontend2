import { useEffect, useState } from 'react';
import './Veproducts.scss';
import { request } from '../../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';
const Veproducts = ({ setNavbarIndex }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setNavbarIndex(8);
    }, [setNavbarIndex]);


    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const [visibilityLoading, setVisibilityLoading] = useState(false);
    const [visibilityError, setVisibilityError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setLoading(true);
                setError(false);
                const res = await request.get('/product/p', {
                    signal, headers: {
                        token: 'Bearer ' + token
                    }
                });
                setProducts(res.data);
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
        }
    }, []);

    const handleDelete = (id) => {
        const fetch = async () => {
            try {
                setDeleteError(false);
                setDeleteLoading(true);
                const token = Cookies.get('token');
                await request.delete('/product/' + id, {
                    headers: {
                        token: 'Bearer ' + token
                    }
                })
                const newProducts = products.filter(product => product._id !== id);
                setProducts(newProducts);
                setDeleteLoading(false);
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) {
                    Cookies.remove('token');
                    navigate('/login');
                    return;
                }
                setDeleteError(true);
                setDeleteLoading(false);
            }
        }
        fetch();
    }

    const handleVisibility = ({ id, isVisible }) => {
        const token = Cookies.get('token');
        setVisibilityError(false);
        setVisibilityLoading(true);
        request.put('/product/ve/visibility', { id, isVisible }, {
            headers: {
                token: 'Bearer ' + token
            }
        }).then((res) => {
            setProducts(products.map(product => product._id === res.data._id ? res.data : product));
            setVisibilityLoading(false);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setVisibilityError(true);
            setVisibilityLoading(false);
        })
    }

    return (
        <div className="veproducts">
            <h1>products</h1>
            {deleteError && <div className='error'>
                <div className="errorwrapper">
                    <div className="close">
                        <CloseIcon onClick={() => setDeleteError(false)} />
                    </div>
                    <h3>Internal server error</h3>
                </div>
            </div>}
            {error && <h3 className='ee'>Internal server error</h3>}
            {loading ? <div className="loading"><CircularProgress /></div> : products &&
                <div className="products">
                    {products.length === 0 ? <h1 style={{ marginTop: '60px', color: 'rgb(255, 87, 51)' }}>no products.</h1>
                        :
                        products.map(product => (
                            <div className="product" key={product._id}>
                                <div className="img">
                                    <img src={product.img} alt="" />
                                </div>
                                <h2>{product.name}</h2>
                                <div className="details">
                                    <h3>{product.category}</h3>
                                    <h3><span>$</span>{product.price}</h3>
                                </div>
                                <div className="buttons">
                                    <button><Link to={'/products/ve/' + product._id}>edit</Link></button>
                                    <button disabled={deleteLoading} onClick={() => handleDelete(product._id)} style={{ padding: '5px 10px' }}>delete</button>
                                </div>
                                <button className={product.isVisible ? 'visibility hide' : 'visibility show'} disabled={visibilityLoading} onClick={() => handleVisibility({ id: product._id, isVisible: product.isVisible })} style={{ padding: '5px 10px' }}>{product.isVisible ? 'Hide' : 'Show'}</button>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Veproducts;