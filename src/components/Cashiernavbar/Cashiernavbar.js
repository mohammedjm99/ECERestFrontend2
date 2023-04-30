import { Link } from 'react-router-dom';
import './Cashiernavbar.scss';
import Cookies from 'js-cookie';

const Navbar = ({ navbarIndex }) => {
    const handleLogout = ()=>{
        Cookies.remove('token');
    }
    return (
        <div className="cashiernavbar">
            <ul>
                <li><Link to={'/cashier/orders/create'} className={navbarIndex === 1 ? 'active' : ''}>Create Order</Link></li>
                <li><Link to={'/cashier/orders/inprogress'} className={navbarIndex === 2 ? 'active' : ''}>In Progress</Link></li>
                <li><Link to={'/cashier/tables/qr'} className={navbarIndex === 6 ? 'active' : ''}>QR Codes</Link></li>
                <li><Link onClick={handleLogout} to={'/login'} style={{'marginLeft':'30px'}}>Logout</Link></li>
            </ul>
        </div>
    )
}

export default Navbar