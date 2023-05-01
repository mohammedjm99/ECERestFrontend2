import './Right.scss';
import { useState } from 'react';
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { useEffect } from 'react';

const Right = ({ tables }) => {
    const [activeTable, setActiveTable] = useState(null);
    const [error, setError] = useState(false);
    const [gantry,setGantry] = useState('homing');
    const dbRef = ref(getDatabase(), '/gantry');

    useEffect(() => {
        const handleData = (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setGantry(data);
            }
        };
        onValue(dbRef, handleData);
        return () => {
            off(dbRef, handleData);
        };
    }, []);
    const handleGo = () => {
        setError(false);
        if (activeTable === null) {
            setError(true);
            return;
        }
        set(dbRef, `${activeTable.number}$${activeTable.distance}%`);
    }

    const handleHome = () => {
        set(dbRef, `homing`);
    }

    return (
        <div className='right'>
            <div className="logo">
                <h1>Gantry</h1>
                <p>Controller</p>
            </div>

            <div className="numbers">
                {tables && tables.map(table => (
                    <button key={table._id} onClick={() => setActiveTable(table)} className={activeTable?._id === table._id ? 'active' : ''}>{table.number}</button>
                ))}
            </div>

            <div className="buttons">
                <button disabled={gantry==='home'?false:true} onClick={handleHome}>Home</button>
                <button disabled={gantry==='home'?false:true} onClick={handleGo}>Go</button>
            </div>

            {error && <p className='error'>Error, make sure you selected a table</p>}
        </div>
    )
}

export default Right