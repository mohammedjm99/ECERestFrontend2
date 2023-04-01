import { useEffect } from 'react';
import './Createorders.scss';
const Createorders = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(1);
    },[setNavbarIndex]);
    return(
        <div className="Createorders">
            Create orders
        </div>
    )
}

export default Createorders;