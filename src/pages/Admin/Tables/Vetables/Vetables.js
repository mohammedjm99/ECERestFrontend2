import { useEffect, useState } from 'react';
import './Vetables.scss';
import { request } from '../../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
const Vetables = ({ setNavbarIndex }) => {

    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setNavbarIndex(5);
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/table', { signal });
                setTables(res.data);
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
    }, [setNavbarIndex]);

    const handleDelete = (id)=>{
        const fetch = async()=>{
            try{
                await request.delete('/table/'+id)
                const newTables = tables.filter(table=>table._id !== id);
                setTables(newTables);
            }catch(e){
                console.log(e);
            }
        }
        fetch();
    }

    return (
        <div className="vetables">
            <h1>tables</h1>
            {loading ? <div className="loading"><CircularProgress /></div> : tables &&
                <div className="tables">
                    {tables.length === 0 ? <h1 style={{marginTop:'60px',color:'rgb(255, 87, 51)'}}>no tables.</h1>
                    :
                    tables.map(table=>(
                        <div className="table" key={table._id}>
                            <h2>Table Number <span>#{table.number}</span></h2>
                            <h3>Distance: <span>{table.distance}cm</span></h3>
                            <div className="buttons">
                                <button><Link to={'/admin/tables/ve/'+table._id}>edit</Link></button>
                                <button onClick={()=>handleDelete(table._id)} style={{padding:'5px 10px'}}>delete</button>
                            </div>
                        </div>
                    ))
                    }
                </div>
            }
        </div>
    )
}

export default Vetables;