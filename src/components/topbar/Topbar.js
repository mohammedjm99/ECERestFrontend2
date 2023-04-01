import './Topbar.scss';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

const Topbar = ()=>{
    const token = Cookies.get('token');
    const table = token ? jwtDecode(token) : null;
    return(
        <div className="topbar">
            <div className="logo">
                <LocalDiningIcon className='icon'/>
                <h1>ECE Rest.</h1>
            </div>
            {table && <p>{table.rule}</p>}
        </div>
    )
}

export default Topbar