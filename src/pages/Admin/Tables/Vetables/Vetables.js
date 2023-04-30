import { useEffect, useState } from 'react';
import './Vetables.scss';
import { request } from '../../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
const Vetables = ({ setNavbarIndex }) => {
    const navigate = useNavigate();
    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [deleteLoading,setDeleteLoading] = useState(false);
    const [deleteError,setDeleteError] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        const controller = new AbortController();
        const signal = controller.signal;
        setNavbarIndex(5);
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/table', { signal, headers:{
                    token:'Bearer '+token
                } });
                setTables(res.data.tables);
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
    }, [setNavbarIndex]);

    const handleDelete = (id) => {
        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setDeleteError(false);
                setDeleteLoading(true);
                await request.delete('/table/' + id,{headers:{
                    token:'Bearer '+token
                }})
                const newTables = tables.filter(table => table._id !== id);
                setTables(newTables);
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

console.log(tables);

    return (
        <div className="vetables">
            <h1>tables</h1>
            {error && <h3 className='ee'>Internal server error</h3>}
            {deleteError && <div className='error'>
                <div className="errorwrapper">
                    <div className="close">
                        <CloseIcon onClick={() => setDeleteError(false)} />
                    </div>
                    <h3>Internal server error</h3>
                </div>
            </div>}
            {loading ? <div className="loading"><CircularProgress /></div> : tables &&
                <div className="tables">
                    {tables.length === 0 ? <h1 style={{ marginTop: '60px', color: 'rgb(255, 87, 51)' }}>no tables.</h1>
                        :
                        tables.map(table => (
                            <div className="table" key={table._id}>
                                <h2>Table Number <span>#{table.number}</span></h2>
                                <h3>Distance: <span>{table.distance}cm</span></h3>
                                <div className="buttons">
                                    <button><Link to={'/tables/ve/' + table._id}>edit</Link></button>
                                    <button disabled={deleteLoading} onClick={() => handleDelete(table._id)} style={{ padding: '5px 10px' }}>delete</button>
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