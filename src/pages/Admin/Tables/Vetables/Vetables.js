import { useEffect } from 'react';
import './Vetables.scss';
const Vetables = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(5);
    },[setNavbarIndex]);
    return(
        <div className="vetables">
            view and edit tables
        </div>
    )
}

export default Vetables;