import { useEffect } from 'react';
import './Veusers.scss';
const Veusers = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(10);
    },[setNavbarIndex]);
    return(
        <div className="veusers">
            view and edit users
        </div>
    )
}

export default Veusers;