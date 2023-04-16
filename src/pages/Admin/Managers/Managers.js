import { useEffect, useState } from 'react';
import './Managers.scss';
import { CircularProgress } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddIcon from '@mui/icons-material/Add';
import { request } from '../../../api/axiosMethods';

function Manager({ manager, setManagers, managers }) {
    const [username, setusername] = useState(manager.username);
    const [password, setpassword] = useState("fakeOne!!!!!!");
    const [rule, setrule] = useState(manager.rule);
    const [oldData, setOldData] = useState(manager);
    const [isChanged, setIsChanged] = useState(false);

    const [sLoading, setSLoading] = useState(false);
    const [sError, setSError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (oldData.username !== username || password !== "fakeOne!!!!!!" || oldData.rule !== rule) setIsChanged(true);
        else setIsChanged(false);
    }, [username, password, rule])

    const handleDelete = () => {
        request.delete('/manager/' + manager._id).then(res => {
            const newManagers = managers.filter(m => m._id !== manager._id);
            setManagers(newManagers);
        })
    };

    const handleEdit = () => {
        console.log('edit', '  ', username, password, rule);
    }

    return (
        <div className="manager">
            {username === 'diler' ?
                <>
                    <p>{username}</p>
                    <div className="input">
                        <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                        <CloseOutlinedIcon className='icon' onClick={() => setpassword('')} />
                    </div>
                    <select value={rule} onChange={(e) => setrule(e.target.value)}>
                        <option value="admin">Admin</option>
                    </select>
                    <button className='edit' disabled={!isChanged} onClick={handleEdit}>Edit</button>
                </>
                :
                <>
                    <div className="input">
                        <input type="text" value={username} onChange={(e) => setusername(e.target.value)} />
                        <CloseOutlinedIcon className='icon' onClick={() => setusername('')} />
                    </div>
                    <div className="input">
                        <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                        <CloseOutlinedIcon className='icon' onClick={() => setpassword('')} />
                    </div>
                    <select value={rule} onChange={(e) => setrule(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="chief">chief</option>
                    </select>
                    <button className='edit' disabled={!isChanged} onClick={handleEdit}>Edit</button>
                    <button className='delete' onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    );
}

const Managers = ({ setNavbarIndex }) => {

    const [managers, setManagers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setNavbarIndex(9);
        const fetch = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await request.get('/manager', { signal });
                setManagers(res.data);
                setLoading(false);
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        }
        fetch();

        return () => {
            controller.abort();
        }
    }, [setNavbarIndex]);

    const handleAdd = () => {
        setShowForm(true);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setShowForm(false);
    }

    return (
        <div className="managers">
            <h1>managers</h1>
            <div className="add" onClick={handleAdd}>
                <AddIcon className='icon' />
                <h2>add manager</h2>
            </div>
            {showForm && <div className="form">
                <form>
                    <label>
                        name
                        <input type="text" placeholder='Ex: Mohammed' />
                    </label>
                    <label>
                        password
                        <input type="password" placeholder='Ex: ECERestaurant18' />
                    </label>
                    <label>
                        rule
                        <select defaultValue="f">
                            <option disabled value={'f'}>Select</option>
                            <option value="admin">Admin</option>
                            <option value="chief">chief</option>
                        </select>
                    </label>
                    <button>add</button>
                    <CloseOutlinedIcon className='cancel' onClick={()=>setShowForm(false)}/>
                </form>
            </div>}
            {loading ? <div className="loading"><CircularProgress /></div>
                : managers && <div className="managerss">
                    <div className="headings">
                        <h3>username</h3>
                        <h3>password</h3>
                        <h3>rule</h3>
                    </div>
                    {managers.map(manager => (
                        <Manager key={manager._id} manager={manager} setManagers={setManagers} managers={managers} />
                    ))}
                </div>
            }
            {error && <p style={{ marginTop: '20px', color: 'rgb(255, 87, 51)', textAlign: 'center' }}>internal server error</p>}
        </div>
    )
}

export default Managers;