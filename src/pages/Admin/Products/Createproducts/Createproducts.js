import { useEffect } from 'react';
import './Createproducts.scss';
const Createproducts = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(7);
    },[setNavbarIndex]);
    return(
        <div className="createproducts">
            Create Products
        </div>
    )
}

export default Createproducts;