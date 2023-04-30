import { useEffect, useState } from 'react';
import './Dashboard.scss';
import { request } from '../../../api/axiosMethods';
import { CircularProgress } from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)


const Dashboard = ({ setNavbarIndex }) => {
    const [countTables, setCountTables] = useState(null);
    const [countProducts, setCountProducts] = useState(null);
    const [todayOrders, setTodayOrders] = useState(null);
    const [totalFourWeeks, setTotalFourWeeks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get('token');
        setNavbarIndex(0);
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        setError(false);

        request.get('order/dashboard', { signal,
            headers:{token:'Bearer '+token}
         }).then(res => {
            setCountTables(res.data.countTables);
            setCountProducts(res.data.countProducts);
            setTodayOrders(res.data.todayOrders);
            setTotalFourWeeks(res.data.total);
        }).then(() => {
            setLoading(false);
        }).catch(e => {
            if(e.response?.status===403 || e.response?.status===401){
                Cookies.remove('token');
                navigate('/login');
                return;
            }
            setLoading(false);
            setError(true);
        })

        return () => {
            controller.abort();
        }
    }, [setNavbarIndex]);
    const chartData = {
        labels: ['Current Week', '1 Week Ago', '2 Weeks Ago', '3 Weeks Ago','4 Weeks Ago'],
        datasets: [
            {
                label: 'Total Income ($)',
                data: totalFourWeeks,
                barThickness: 50,
                backgroundColor: '#f54749',
                borderColor: '#dadada',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 16 // change font size here
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 16 // change font size here
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16 // change font size here
                    }
                }
            }
        }
    };


    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {error && <p className='error'>Internal server error.</p>}
            {loading ? <div className="loading"><CircularProgress /></div> :
                !error && <div className="wrapper">
                    <div className="sections">
                        <div className="section">
                            <div className="icon">
                                <TableRestaurantIcon />
                            </div>
                            <div>
                                <h3>number of tables</h3>
                                <h2>{countTables}</h2>
                            </div>
                        </div>
                        <div className="section">
                            <div className="icon">
                                <FastfoodOutlinedIcon />
                            </div>
                            <div>
                                <h3>number of products</h3>
                                <h2>{countProducts}</h2>
                            </div>
                        </div>
                        <div className="section">
                            <div className="icon">
                                <FormatListBulletedOutlinedIcon />
                            </div>
                            <div>
                                <h3>today total orders</h3>
                                <h2>{todayOrders?.count}</h2>
                            </div>
                        </div>
                        <div className="section">
                            <div className="icon">
                                <MonetizationOnOutlinedIcon />
                            </div>
                            <div>
                                <h3>today total income</h3>
                                <h2>${todayOrders?.totalPrice}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="charts">
                        <div className="one">
                            <div>
                                <h2>total income for previous four weeks is <span>${totalFourWeeks && totalFourWeeks.reduce((a,b)=>a+b,0)}</span></h2>
                            </div>
                        </div>
                        <div className="two">
                            <Bar data={chartData} options={chartOptions}></Bar>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard;