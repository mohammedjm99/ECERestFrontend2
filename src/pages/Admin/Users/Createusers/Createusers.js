import { useEffect } from 'react';
import './Createusers.scss';
const Createusers = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(9);
    },[setNavbarIndex]);

    return(
        <div className="createusers">
            Create users
        </div>
    )
}

export default Createusers;