import { useEffect, useRef, useState } from 'react';
import { request } from '../../../../api/axiosMethods';
import './Addeditproduct.scss';
import { CircularProgress } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import { storage } from '../../../../api/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Cookies from 'js-cookie';


const Addeditproduct = ({ setNavbarIndex, title }) => {

    const nameRef = useRef(null);
    const [imgKey, setImgKey] = useState(0);

    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');
    const [img, setImg] = useState(null);
    const [oldData, setOldData] = useState({});
    const [isChanged, setIschanged] = useState(false);

    const [sLoading, setSLoading] = useState(false);
    const [sError, setSError] = useState('');
    const [success, setSuccess] = useState(false);

    const id = useParams().id;

    useEffect(() => {
        if (title === 'edit') {
            if (oldData.name !== name || oldData.category !== category || oldData.price != price || oldData.img !== img) {
                setIschanged(true);
            } else {
                setIschanged(false);
            }
        }
    }, [name, price, category, img, oldData.name, oldData.category, oldData.img, oldData.price]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (title === 'add') {
            setNavbarIndex(7);
            const fetch = async () => {
                try {
                    const token = Cookies.get('token');
                    setLoading(true);
                    setError(false);
                    const res = await request.get('/product/c', {
                        signal, headers: {
                            token: 'Bearer ' + token
                        }
                    });
                    setCategories(res.data);
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
        } else if (title === 'edit') {
            setNavbarIndex(8);
            const fetch = async () => {
                try {
                    const token = Cookies.get('token');
                    setLoading(true);
                    setError(false);
                    const res = await request.get('/product/ve/' + id, {
                        signal, headers: {
                            token: 'Bearer ' + token
                        }
                    });
                    setCategories(res.data.categories);
                    setName(res.data.product.name);
                    setCategory(res.data.product.category);
                    setPrice(res.data.product.price);
                    setImg(res.data.product.img);
                    setOldData(res.data.product);
                    setLoading(false);
                } catch (e) {
                    if (e.response?.status === 403 || e.response?.status === 401) {
                        Cookies.remove('token');
                        navigate('/login');
                        return;
                    }
                    setError(true);
                    setLoading(false);
                    navigate('/products/ve');
                }
            }
            fetch();
        }

        return () => {
            controller.abort();
        }
    }, [title]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSLoading(true);
        setSError('');
        setSuccess('');

        if (!navigator.onLine) {
            setSError('No internet connection.');
            setSLoading(false);
            return;
        }
        if (!img || !name || !price || !category) {
            setSError('Please fill all fields.');
            setSLoading(false);
            return;
        }
        if (name.length > 20) {
            setSError('name must be less than 20 characters.');
            setSLoading(false);
            return;
        }
        if (category.length > 12) {
            setSError('category must be less than 12 caracters.');
            setSLoading(false);
            return;
        }

        if (typeof (img) === 'string') {
            const data = {
                name,
                category,
                img,
                price

            };
            const token = Cookies.get('token');
            request.put('/product/' + id, data,{headers:{
                token:'Bearer '+token
            }})
                .then(() => {
                    setOldData(data)
                    setSuccess('product updated successfully!');
                    setSLoading(false);
                })
                .catch(() => {
                    setSError("internal server error.");
                    setSLoading(false);
                });
            return;
        }

        const imgName = new Date().getTime() + img.name;
        const storageRef = ref(storage, imgName);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((downloadURL) => {
                        const data = {
                            name,
                            category,
                            img: downloadURL,
                            price

                        };
                        const token = Cookies.get('token');
                        if (title === 'add') {
                            request.post('/product', data,{headers:{
                                token:'Bearer '+token
                            }})
                                .then(() => {
                                    if (!categories.includes(category)) setCategories([...categories, category]);
                                    setSuccess('product Added successfully!');
                                    setImgKey(p => p + 1);
                                    setName('');
                                    setCategory('');
                                    setPrice('');
                                    setImg(null);
                                    setSLoading(false);
                                    nameRef.current.focus();
                                })
                                .catch(() => {
                                    setSError("internal server error.");
                                    setSLoading(false);
                                });
                        } else if (title === 'edit') {
                            request.put('/product/' + id, data,{headers:{
                                token:'Bearer '+token
                            }})
                                .then(() => {
                                    setOldData(data);
                                    setSuccess('product updated successfully!');
                                    setSLoading(false);
                                })
                                .catch((e) => {
                                    setSError("internal server error.");
                                    setSLoading(false);
                                });
                        }
                    })
                    .catch(() => {
                        setSError("can't upload this image.");
                        setSLoading(false);
                    });
            })
            .catch(() => {
                setSError("can't upload this image.");
                setSLoading(false);
            });

    }

    const handleBrowseImg = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = 500;
                canvas.height = 500;

                ctx.drawImage(img, 0, 0, 500, 500);

                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, { type: file.type });
                    setImg(resizedFile);
                }, file.type);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="addeditproduct">
            <h1>{title} product</h1>
            {error && <h3 className='ee'>Internal server error</h3>}
            {loading ? <div className="loading"><CircularProgress /></div> : categories &&
                <div className="form">
                    {title === 'edit' && <div className="arrow" onClick={() => navigate('/products/ve')}><ArrowBackIosNewIcon /></div>}
                    <form onSubmit={handleSubmit} style={title === 'add' ? { marginTop: '50px' } : { marginTop: '20px' }}>
                        <label>
                            Name
                            <div className="input">
                                <input type="text" onChange={(e) => setName(e.target.value)} placeholder='ex: papperoni pizza' value={name} ref={nameRef} />
                                <CloseOutlinedIcon onClick={() => setName('')} style={{ cursor: 'pointer' }} />
                            </div>
                        </label>
                        <label>
                            Category
                            <div className="input">
                                <input type="text" onChange={(e) => setCategory(e.target.value)} value={category} placeholder='ex: pizza,burgers,drinks..' />
                                <CloseOutlinedIcon onClick={() => setCategory('')} style={{ cursor: 'pointer' }} />
                            </div>
                            <div className="categories" style={{ marginTop: '10px' }}>
                                {categories.map(c => (
                                    <p style={{ fontSize: '16px' }} key={c} onClick={() => setCategory(c)} className={category.toLowerCase() === c.toLowerCase() ? 'active' : ''}>{c}</p>
                                ))}
                            </div>
                        </label>
                        <label>
                            Price ($)
                            <div className="input">
                                <input type="number" id="number" onChange={(e) => setPrice(e.target.value)} placeholder='ex: 12' value={price} />
                                <CloseOutlinedIcon onClick={() => setPrice('')} style={{ cursor: 'pointer' }} />
                            </div>
                        </label>
                        <label id='imgcontainer'>
                            <input type="file" name='img' id='img' onChange={handleBrowseImg} key={imgKey} />
                            <label htmlFor="img" style={{ flexDirection: 'row', gap: '5px', alignItems: 'center', cursor: 'pointer' }}>Choose an image<FileUploadOutlinedIcon /></label>
                            {img ? <img src={typeof (img) === 'string' ? img : URL.createObjectURL(img)} alt="" id='browsedimg' /> : <ImageNotSupportedIcon />}
                        </label>
                        {title === 'add' ? <button className='add' disabled={sLoading}>submit</button>
                            : title === 'edit' ? <button className='edit' disabled={sLoading || !isChanged}>edit</button>
                                : ''}
                    </form>
                    {sError && <p style={{ marginTop: '20px', color: 'rgb(255, 87, 51)' }}>{sError}</p>}
                    {success && <p style={{ marginTop: '20px', color: 'rgb(0, 126, 51)' }}>{success}</p>}
                    {sLoading && <CircularProgress style={{ marginTop: '20px' }} />}
                </div>
            }
        </div>
    )
}

export default Addeditproduct;