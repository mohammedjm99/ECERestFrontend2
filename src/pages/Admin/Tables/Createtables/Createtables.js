import { useEffect } from 'react';
import './Createtables.scss';
const Createtables = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(4);
    },[setNavbarIndex]);
    return(
        <div className="createtables">
            Create tables
        </div>
    )
}

export default Createtables;