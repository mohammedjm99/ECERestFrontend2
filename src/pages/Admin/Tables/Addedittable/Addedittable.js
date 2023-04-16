import { useEffect, useRef, useState } from 'react';
import './Addedittable.scss';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { request } from '../../../../api/axiosMethods';




const Addedittable = ({ title, setNavbarIndex }) => {

    const numberRef = useRef(null);

    const [loading, setLoading] = useState(false);
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
        } else if (title === 'edit') {
            const fetch = async () => {
                try {
                    setLoading(true);
                    setError(false);
                    const res = await request.get('/table/single/' + id, { signal });
                    setNumber(res.data.number);
                    setDistance(res.data.distance);
                    setOldData(res.data);
                    setLoading(false);
                } catch (e) {
                    setError(true);
                    setLoading(false);
                }
            }
            fetch();
            setNavbarIndex(5);
        }

        return () => {
            controller.abort();
        }
    }, [setNavbarIndex, title]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const fetch = async () => {
            try {
                setSLoading(true);
                setSError(null);
                if (!number || !distance) {
                    setSError('Please fill all fields.');
                    setSuccess('');
                    setSLoading(false);
                    return;
                }
                if (title === 'add') {
                    await request.post('/table', { number, distance });
                    setSuccess('Table added successfully.');
                    setSLoading(false);
                    setDistance('');
                    setNumber('');
                    numberRef.current.focus();
                }else if(title === 'edit'){
                    const res = await request.put('/table/single/'+id,{number,distance});
                    setOldData(res.data);
                    setSuccess('Table updated successfully.');
                    setSLoading(false);
                }
            } catch (e) {
                setSuccess('');
                setSError("Internal server error.");
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
                    {title === 'edit' && <div className="arrow" onClick={() => navigate('/admin/tables/ve')}><ArrowBackIosNewIcon /></div>}
                    <form onSubmit={handleSubmit} style={title === 'add' ? { marginTop: '50px' } : { marginTop: '20px' }}>
                        <label>
                            Number
                            <div className="input">
                                <input type="number" onChange={(e) => setNumber(e.target.value)} placeholder='ex: 3' value={number} ref={numberRef}/>
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