import { useEffect } from 'react';
import './Veproducts.scss';
const Veproducts = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(8);
    },[setNavbarIndex]);
    return(
        <div className="veproducts">
            view and edit products
        </div>
    )
}

export default Veproducts;