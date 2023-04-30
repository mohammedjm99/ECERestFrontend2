import './Right.scss';
import { useEffect, useState} from 'react';

const Right = ({tables}) => {
    const [activeTable,setActiveTable] = useState(null);

    const handleGo = ()=>{
        console.log(activeTable)
        console.log('handleGo')
    }

    const handleHome = ()=>{
        console.log('handleHome')
    }

    // console.log(activeTable)

    useEffect(()=>{
        console.log('first');
    },[])

    return (
        <div className='right'>
            <div className="logo">
                <h1>Gantry</h1>
                <p>Controller</p>
            </div>

            <div className="numbers">
                {tables && tables.map(table=>(
                    <button key={table._id} onClick={()=>setActiveTable(table)} className={activeTable?._id===table._id ? 'active' : ''}>{table.number}</button>
                ))}
            </div>

            <div className="buttons">
                <button onClick={handleHome}>Home</button>
                <button onClick={handleGo}>Go</button>
            </div>
        </div>
    )
}

export default Right