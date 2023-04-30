import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CachedIcon from '@mui/icons-material/Cached';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RateReviewIcon from '@mui/icons-material/RateReview';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';

const Navbar = ({navbarIndex}) => {
    const navigate = useNavigate();
    const handleLogout = ()=>{
        Cookies.remove('token');
    }
    return (
        <div className="navbar">
            <div className="logo">
                <LocalDiningIcon className='icon'/>
                <h1>ECE Rest.</h1>
            </div>
            <ul className='main-list'>
                <li>Main</li>
                <ul className='sub-list'>
                    <li><Link to="/dashboard" className={navbarIndex === 0 ? 'active' : ''}><DashboardIcon className='icon'/>dashboard</Link></li>
                </ul>

                <li>Orders</li>
                <ul className='sub-list'>
                    <li><Link to="/orders/create" className={navbarIndex === 1 ? 'active' : ''}><AddBoxIcon className='icon'/>create</Link></li>
                    <li><Link to="/orders/inprogress" className={navbarIndex === 2 ? 'active' : ''}><CachedIcon className='icon'/>in progress</Link></li>
                    <li><Link to="/orders/paid" className={navbarIndex === 3 ? 'active' : ''}><FactCheckIcon className='icon'/>paid</Link></li>
                </ul>

                <li>Tables</li>
                <ul className='sub-list'>
                    <li><Link to="/tables/add" className={navbarIndex === 4 ? 'active' : ''}><AddBoxIcon className='icon'/>Add</Link></li>
                    <li><Link to="/tables/ve" className={navbarIndex === 5 ? 'active' : ''}><RateReviewIcon className='icon'/>view & edit</Link></li>
                    <li><Link to="/tables/qr" className={navbarIndex === 6 ? 'active' : ''}><QrCodeScannerIcon className='icon'/>QR code</Link></li>
                </ul>

                <li>Products</li>
                <ul className='sub-list'>
                    <li><Link to="/products/add" className={navbarIndex === 7 ? 'active' : ''}><AddBoxIcon className='icon'/>add</Link></li>
                    <li><Link to="/products/ve" className={navbarIndex === 8 ? 'active' : ''}><RateReviewIcon className='icon'/>view & edit</Link></li>
                </ul>

                <li>Managers</li>
                <ul className='sub-list'>
                    <li><Link to="/managers" className={navbarIndex === 9 ? 'active' : ''}><AddBoxIcon className='icon'/>Add & View & Edit</Link></li>
                    <li><Link onClick={handleLogout} to={'/login'}><LogoutIcon className='icon'/>Logout</Link></li>
                </ul>
            </ul>
        </div>
    )
}

export default Navbar