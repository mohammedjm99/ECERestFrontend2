import { Link } from 'react-router-dom';
import './Navbar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CachedIcon from '@mui/icons-material/Cached';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RateReviewIcon from '@mui/icons-material/RateReview';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

const Navbar = ({navbarIndex}) => {
    return (
        <div className="navbar">
            <div className="logo">
                <LocalDiningIcon className='icon'/>
                <h1>ECE Rest.</h1>
            </div>
            <ul className='main-list'>
                <li>Main</li>
                <ul className='sub-list'>
                    <li><Link to="/admin" className={navbarIndex === 0 ? 'active' : ''}><DashboardIcon className='icon'/>dashboard</Link></li>
                </ul>

                <li>Orders</li>
                <ul className='sub-list'>
                    <li><Link to="/admin/orders/create" className={navbarIndex === 1 ? 'active' : ''}><AddBoxIcon className='icon'/>create</Link></li>
                    <li><Link to="/admin/orders/inprogress" className={navbarIndex === 2 ? 'active' : ''}><CachedIcon className='icon'/>in progress</Link></li>
                    <li><Link to="/admin/orders/paid" className={navbarIndex === 3 ? 'active' : ''}><FactCheckIcon className='icon'/>paid</Link></li>
                </ul>

                <li>Tables</li>
                <ul className='sub-list'>
                    <li><Link to="/admin/tables/create" className={navbarIndex === 4 ? 'active' : ''}><AddBoxIcon className='icon'/>create</Link></li>
                    <li><Link to="/admin/tables/ve" className={navbarIndex === 5 ? 'active' : ''}><RateReviewIcon className='icon'/>view & edit</Link></li>
                    <li><Link to="/admin/tables/qr" className={navbarIndex === 6 ? 'active' : ''}><QrCodeScannerIcon className='icon'/>QR code</Link></li>
                </ul>

                <li>Products</li>
                <ul className='sub-list'>
                    <li><Link to="/admin/products/create" className={navbarIndex === 7 ? 'active' : ''}><AddBoxIcon className='icon'/>create</Link></li>
                    <li><Link to="/admin/products/ve" className={navbarIndex === 8 ? 'active' : ''}><RateReviewIcon className='icon'/>view & edit</Link></li>
                </ul>

                <li>Users</li>
                <ul className='sub-list'>
                    <li><Link to="/admin/users/create" className={navbarIndex === 9 ? 'active' : ''}><AddBoxIcon className='icon'/>create</Link></li>
                    <li><Link to="/admin/users/ve" className={navbarIndex === 10 ? 'active' : ''}><RateReviewIcon className='icon'/>view & edit</Link></li>
                </ul>
            </ul>
        </div>
    )
}

export default Navbar