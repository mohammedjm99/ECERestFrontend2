import { useEffect, useState } from 'react';
import './Managers.scss';
import { CircularProgress } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddIcon from '@mui/icons-material/Add';
import { request } from '../../../api/axiosMethods';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Manager = ({ i, manager, setManagers, managers, setEditError, setEditLoading, setEditSuccess,editLoading }) => {
    const navigate = useNavigate();
    const [username, setusername] = useState(manager.username);
    const [password, setpassword] = useState("fakeOne!!!!!!");
    const [rule, setrule] = useState(manager.rule);
    const [oldData, setOldData] = useState(manager);
    const [isChanged, setIsChanged] = useState(false);
    const [deleteLoading,setDeleteLoading] = useState(false);

    useEffect(() => {
        if (oldData.username !== username || password !== "fakeOne!!!!!!" || oldData.rule !== rule) setIsChanged(true);
        else setIsChanged(false);
    }, [username, password, rule, oldData.password, oldData.username, oldData.rule])

    const handleDelete = () => {
        setDeleteLoading(true);
        const token = Cookies.get('token');
        request.delete('/manager/' + manager._id, {
            headers: {
                token: 'Bearer ' + token
            }
        }).then(res => {
            const newManagers = managers.filter(m => m._id !== manager._id);
            setManagers(newManagers);
            setDeleteLoading(false);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setDeleteLoading(false);
            console.log(e);
        })
    };

    const handleEdit = () => {
        setEditError('');
        setEditSuccess('');
        if (username.length < 8) {
            setEditError('username must be at least of 8 characters.');
            return;
        }
        if (password.length < 8) {
            setEditError('password must be at least of 8 characters.');
            return;
        }

        setEditLoading(true);
        const token = Cookies.get('token');
        request.put('manager/' + manager._id, {
            username,
            password,
            rule
        }, {
            headers: {
                token: 'Bearer ' + token
            }
        }).then(res => {
            setOldData(res.data);
            setpassword('fakeOne!!!!!!');
            setEditSuccess(true);
            setEditLoading(false);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setEditSuccess('');
            setEditLoading(false);
            setEditError(e.response.data);
        });
    }

    const handleFocus = (e) => {
        if (e.target.value === 'fakeOne!!!!!!') setpassword('');
    }

    const handleBlur = (e) => {
        if (e.target.value === '') setpassword('fakeOne!!!!!!');
    }
    return (
        <div className="manager">
            {i === 0 ?
                <>
                    <p>{username}</p>
                    <div className="input">
                        <input type="password" onFocus={handleFocus} onBlur={handleBlur} value={password} onChange={(e) => setpassword(e.target.value)} />
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
                        <input type="password" onFocus={handleFocus} onBlur={handleBlur} value={password} onChange={(e) => setpassword(e.target.value)} />
                        <CloseOutlinedIcon className='icon' onClick={() => setpassword('')} />
                    </div>
                    <select value={rule} onChange={(e) => setrule(e.target.value)}>
                        <option value="cashier">Cashier</option>
                        <option value="chef">Chef</option>
                    </select>
                    <button className='edit' disabled={!isChanged || editLoading} onClick={handleEdit}>Edit</button>
                    <button disabled={deleteLoading} className='delete' onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    );
}

const Managers = ({ setNavbarIndex }) => {
    const navigate = useNavigate();
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState(false);

    const [managers, setManagers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [addSuccess, setAddSuccess] = useState(false);
    const [addLoading,setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setNavbarIndex(9);
        const fetch = async () => {
            try {
                const token = Cookies.get('token');
                setLoading(true);
                setError(false);
                const res = await request.get('/manager', {
                    signal, headers: {
                        token: 'Bearer ' + token
                    }
                });
                setManagers(res.data);
                setLoading(false);
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) {
                    Cookies.remove('token');
                    navigate('/login');
                    return;
                }
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
        setEditError('');
        setEditSuccess('');
        setShowForm(true);
    }

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setAddLoading(true);
        setAddError('');
        if (e.target.name.value.length < 8) {
            setAddError('username must be at least of 8 characters.');
            return;
        }
        if (e.target.password.value.length < 8) {
            setAddError('password must be at least of 8 characters.');
            return;
        }
        if (e.target.rule.value === 'f') {
            setAddError('select a rule');
            return;
        }
        const token = Cookies.get('token');
        request.post('/manager', {
            username: e.target.name.value,
            password: e.target.password.value,
            rule: e.target.rule.value
        }, {
            headers: {
                token: 'Bearer ' + token
            }
        }).then(res => {
            const newManager = [...managers, res.data];
            setManagers(newManager);
            setAddSuccess(true);
            setShowForm(false);
            setAddLoading(false);
        }).catch(e => {
            if (e.response?.status === 403 || e.response?.status === 401) {
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setAddLoading(false);
            setAddError(e.response.data)
        });
    }

    const handleCloseAdd = () => {
        setShowForm(false);
        setAddError('');
    }

    useEffect(() => {
        if (addSuccess) {
            setTimeout(() => setAddSuccess(false), 3000);
        }
    }, [addSuccess])
    return (
        <div className="managers">
            <h1>managers</h1>
            {loading ? <div className="loading"><CircularProgress /></div>
                :
                <>
                    <div className="add" onClick={handleAdd}>
                        <AddIcon className='icon' />
                        <h2>add manager</h2>
                    </div>
                    {showForm && <div className="form">
                        <form onSubmit={handleAddSubmit}>
                            <label>
                                name
                                <input type="text" placeholder='Ex: Mohammed' name='name' />
                            </label>
                            <label>
                                password
                                <input type="password" placeholder='Ex: ECERestaurant18' name='password' />
                            </label>
                            <label>
                                rule
                                <select defaultValue="f" name='rule'>
                                    <option disabled value={'f'}>Select</option>
                                    <option value="cashier">Cashier</option>
                                    <option value="chef">Chef</option>
                                </select>
                            </label>
                            <button disabled={addLoading}>add</button>
                            <CloseOutlinedIcon className='cancel' onClick={handleCloseAdd} />
                            {addError && <p style={{ color: '#f54749', textAlign: 'center' }}>{addError}</p>}
                        </form>
                    </div>}
                    {managers && <div className="managerss">
                        <div className="headings">
                            <h3>username</h3>
                            <h3>password</h3>
                            <h3>role</h3>
                        </div>
                        {managers.map((manager, i) => (
                            <Manager key={manager._id} i={i} manager={manager} setManagers={setManagers} managers={managers} editLoading={editLoading} setEditError={setEditError} setEditLoading={setEditLoading} setEditSuccess={setEditSuccess} />
                        ))}
                    </div>}
                </>
            }
            {error && <p style={{ marginTop: '20px', color: 'rgb(255, 87, 51)', textAlign: 'center' }}>internal server error</p>}
            {addSuccess && <p style={{ marginTop: '20px', color: 'rgb(0, 126, 51)', textAlign: 'center' }}>manager added successfully</p>}
            {editError && <p style={{ marginTop: '20px', color: 'rgb(255, 87, 51)', textAlign: 'center' }}>{editError}</p>}
            {editSuccess && <p style={{ marginTop: '20px', color: 'rgb(0, 126, 51)', textAlign: 'center' }}>Edited successfully</p>}
        </div>
    )
}

export default Managers;