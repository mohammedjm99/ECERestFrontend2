import { useEffect, useState } from 'react';
import { request } from '../../../../api/axiosMethods';
import './QR.scss';
import QRCode from 'qrcode.react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReactToPrint from "react-to-print";
const QR = ({ setNavbarIndex }) => {
    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [clickLoading, setClickLoading] = useState(false);
    const [clickError, setClickError] = useState(false);
    useEffect(() => {
        setNavbarIndex(6);
        const controller = new AbortController();
        const signal = controller.signal;

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
        };
    }, [setNavbarIndex]);

    const regenerate = async (id) => {
        try {
            setClickLoading(true);
            setClickError(false);
            const res = await request.put('/table/qr/' + id);
            const index = tables.findIndex(table => table._id === id);
            tables[index] = res.data;
            setTables(tables);
            setClickLoading(false);

        } catch (e) {
            setClickError(true);
            setClickLoading(false);
        }
    }

    const refs = {};

    return (
        <div className="qr">
            <h1>QR codes</h1>
            {tables && <div className="tables">
                {tables.map(table => (
                    <div className="table" key={table._id}>
                        <div className="wrapper" ref={(ref)=>refs[table._id]=ref}>
                            <h2>table number {table.number}</h2>
                            <p>Wifi <ArrowDropDownIcon/></p>
                            <p>SSID: Mohammed</p>
                            <p>Password: 12344321</p>
                            <p>Login <ArrowDropDownIcon/></p>
                            <QRCode value={`http://172.20.10.5:3000/login/${table.number}$${table.secret}`} />
                        </div>
                        <div className="buttons">
                            <button onClick={() => regenerate(table._id)}>regenerate</button>
                            <ReactToPrint trigger={() => <button>print</button>} content={() => refs[table._id]}/>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default QR;