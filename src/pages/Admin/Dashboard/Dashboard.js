import { useEffect } from 'react';
import './Dashboard.scss';
const Dashboard = ({setNavbarIndex})=>{
    useEffect(()=>{
        setNavbarIndex(0);
    },[setNavbarIndex]);
    return(
        <div className="dashboard">
            Dashboard
        </div>
    )
}

export default Dashboard;