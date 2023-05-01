import { useEffect, useState } from 'react';
import { request } from '../../../../api/axiosMethods';
import './QR.scss';
import QRCode from 'qrcode.react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReactToPrint from "react-to-print";
import { CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
const QR = ({ setNavbarIndex }) => {
    const navigate = useNavigate();

    const [cashier,setCashier] = useState(true);
    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [clickLoading, setClickLoading] = useState(false);
    const [clickError, setClickError] = useState(false);
    useEffect(() => {
        setNavbarIndex(6);
        const controller = new AbortController();
        const signal = controller.signal;

        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setLoading(true);
                setError(false);
                const res = await request.get('/table', {
                    signal, headers: {
                        token: 'Bearer ' + token
                    }
                });
                setTables(res.data.tables);
                if(res.data.rule==='cashier'){ 
                    setCashier(true);
                }else{
                    setCashier(false);
                }
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
        };
    }, [setNavbarIndex]);

    const regenerate = async (id) => {
        try {
            const token = Cookies.get('token');
            setClickLoading(true);
            setClickError(false);
            const res = await request.put('/table/qr/' + id,{},{headers:{
                token:'Bearer '+token
            }});
            const index = tables.findIndex(table => table._id === id);
            tables[index] = res.data;
            setTables(tables);
            setClickLoading(false);

        } catch (e) {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setClickError(true);
            setClickLoading(false);
        }
    }

    const refs = {};

    return (
        <div className="qr">
            {!cashier && <h1>QR codes</h1>}
            {clickError && <div className='error'>
                <div className="errorwrapper">
                    <div className="close">
                        <CloseIcon onClick={() => setClickError(false)} />
                    </div>
                    <h3>Internal server error</h3>
                </div>
            </div>}
            {error && <h3 className='ee'>Internal server error</h3>}
            {loading ? <div className="loading"><CircularProgress /></div> : tables &&
                <div className="tables">
                    {tables.length === 0 ? <h1 style={{ marginTop: '60px', color: 'rgb(255, 87, 51)' }}>no tables.</h1>
                        : tables && tables.map(table => (
                            <div className="table" key={table._id}>
                                <div className="wrapper" ref={(ref) => refs[table._id] = ref}>
                                    <h2>table number {table.number}</h2>
                                    <p>Wifi <ArrowDropDownIcon /></p>
                                    <p>SSID: Mohammed</p>
                                    <p>Password: 12344321</p>
                                    <p>Login <ArrowDropDownIcon /></p>
                                    <QRCode value={`https://ecerest.onrender.com/login/${table.number}$${table.secret}`} />
                                </div>
                                <div className="buttons">
                                    <button disabled={clickLoading} onClick={() => regenerate(table._id)}>regenerate</button>
                                    <ReactToPrint trigger={() => <button>print</button>} content={() => refs[table._id]} />
                                </div>
                            </div>
                        ))}
                </div>}
        </div>
    )
}

export default QR;