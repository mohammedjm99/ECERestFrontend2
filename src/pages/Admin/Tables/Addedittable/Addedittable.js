import { useEffect, useRef, useState } from 'react';
import './Addedittable.scss';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { request } from '../../../../api/axiosMethods';
import Cookies from 'js-cookie';




const Addedittable = ({ title, setNavbarIndex }) => {

    const numberRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [table, setTable] = useState(null);

    const navigate = useNavigate();

    const [number, setNumber] = useState('');
    const [distance, setDistance] = useState('');
    const [oldData, setOldData] = useState({});
    const [isChanged, setIschanged] = useState(false);

    const [sLoading, setSLoading] = useState(false);
    const [sError, setSError] = useState('');
    const [success, setSuccess] = useState('');

    const id = useParams().id;

    useEffect(() => {
        if (title === 'edit') {
            if (oldData.number != number || oldData.distance != distance) {
                setIschanged(true);
            } else {
                setIschanged(false);
            }
        }
    }, [number, distance, oldData.number, oldData.distance])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (title === 'add') {
            setNavbarIndex(4);
            const fetch = async () => {
                try {
                    const token = Cookies.get('token');
                    setLoading(true);
                    setError(false);
                    await request.get('/auth/requireadmin', {
                        signal, headers: {
                            token: 'Bearer ' + token
                        }
                    });
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
        } else if (title === 'edit') {
            setNavbarIndex(5);
            const fetch = async () => {
                try {
                    const token = Cookies.get('token');
                    setLoading(true);
                    setError(false);
                    const res = await request.get('/table/' + id, {
                        signal, headers: {
                            token: 'Bearer ' + token
                        }
                    });
                    setNumber(res.data.number);
                    setDistance(res.data.distance);
                    setOldData(res.data);
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
        }

        return () => {
            controller.abort();
        }
    }, [setNavbarIndex, title]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setSLoading(true);
                setSError(null);
                if (!number || !distance) {
                    setSError('Please fill all fields.');
                    setSuccess('');
                    setSLoading(false);
                    return;
                }
                if (title === 'add') {
                    await request.post('/table', { number, distance }, {
                        headers: {
                            token: 'Bearer ' + token
                        }
                    });
                    setSuccess('Table added successfully.');
                    setSLoading(false);
                    setDistance('');
                    setNumber('');
                    numberRef.current.focus();
                } else if (title === 'edit') {
                    const res = await request.put('/table/' + id, { number, distance }, {
                        headers: {
                            token: 'Bearer ' + token
                        }
                    });
                    setOldData(res.data);
                    setSuccess('Table updated successfully.');
                    setSLoading(false);
                }
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) {
                    Cookies.remove('token');
                    navigate('/login');
                    return;
                }
                setSuccess('');
                setSError(e.response?.data || 'internal server error.');
                setSLoading(false);
            }
        }
        fetch();
    }

    return (
        <div className="addedittable">
            <h1>{title} table</h1>
            {loading ? <div className="loading"><CircularProgress /></div> :
                <div className="form">
                    {title === 'edit' && <div className="arrow" onClick={() => navigate('/tables/ve')}><ArrowBackIosNewIcon /></div>}
                    <form onSubmit={handleSubmit} style={title === 'add' ? { marginTop: '50px' } : { marginTop: '20px' }}>
                        <label>
                            Number
                            <div className="input">
                                <input type="number" onChange={(e) => setNumber(e.target.value)} placeholder='ex: 3' value={number} ref={numberRef} />
                                <CloseOutlinedIcon onClick={() => setNumber('')} style={{ cursor: 'pointer' }} />
                            </div>
                        </label>
                        <label>
                            Distance (cm)
                            <div className="input">
                                <input type="number" onChange={(e) => setDistance(e.target.value)} placeholder='ex: 80' value={distance} />
                                <CloseOutlinedIcon onClick={() => setDistance('')} style={{ cursor: 'pointer' }} />
                            </div>
                        </label>
                        {title === 'add' ? <button className='add' disabled={sLoading}>submit</button>
                            : title === 'edit' ? <button className='edit' disabled={sLoading || !isChanged}>edit</button>
                                : ''}
                    </form>
                    {sError && <p style={{ marginTop: '20px', color: 'rgb(255, 87, 51)' }}>{sError}</p>}
                    {success && <p style={{ marginTop: '20px', color: 'rgb(0, 126, 51)' }}>{success}</p>}
                    {sLoading && <CircularProgress style={{ marginTop: '20px' }} />}
                </div>
            }
        </div>
    )
}

export default Addedittable;