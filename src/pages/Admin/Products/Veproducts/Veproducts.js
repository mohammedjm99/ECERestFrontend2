import { useEffect, useState } from 'react';
import './Veproducts.scss';
import { request } from '../../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
const Veproducts = ({ setNavbarIndex }) => {
    useEffect(() => {
        setNavbarIndex(8);
    }, [setNavbarIndex]);

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/product', { signal });
                setProducts(res.data);
                setLoading(false);
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        }
        fetch();

        return () => {
            controller.abort();
        }
    }, []);

    const handleDelete = (id)=>{
        const fetch = async()=>{
            try{
                await request.delete('/product/'+id)
                const newProducts = products.filter(product=>product._id !== id);
                setProducts(newProducts);
            }catch(e){
                console.log(e);
            }
        }
        fetch();
    }

    return (
        <div className="veproducts">
            <h1>products</h1>
            {loading ? <div className="loading"><CircularProgress /></div> : products &&
                <div className="products">
                    {products.length === 0 ? <h1 style={{marginTop:'60px',color:'rgb(255, 87, 51)'}}>no products.</h1>
                    :
                    products.map(product=>(
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
                                <button><Link to={'/admin/products/ve/'+product._id}>edit</Link></button>
                                <button onClick={()=>handleDelete(product._id)} style={{padding:'5px 10px'}}>delete</button>
                            </div>
                        </div>
                    ))
                    }
                </div>
            }
        </div>
    )
}

export default Veproducts;