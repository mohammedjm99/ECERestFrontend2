import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Requirechef, Requireadmin, Requirecashier } from "./auth/Require";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import Login from "./pages/Login/Login";
import Chef from "./pages/Chef/Chef";
import Createorders from './pages/Admin/Orders/Createorders/Createorders';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Inprogress from './pages/Admin/Orders/Inprogress/Inprogress'
import Paid from "./pages/Admin/Orders/Paid/Paid";
import Addedittable from "./pages/Admin/Tables/Addedittable/Addedittable";
import Vetables from "./pages/Admin/Tables/Vetables/Vetables";
import QR from "./pages/Admin/Tables/QR/QR";
import Veproducts from "./pages/Admin/Products/Veproducts/Veproducts";
import Addeditproduct from './pages/Admin/Products/Addeditproduct/Addeditproduct';
import Inprogresstable from './pages/Admin/Orders/Inprogresstable/Inprogresstable';
import Managers from './pages/Admin/Managers/Managers';

import { Ws } from './api/socketLink';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
const socket = io(Ws);

const App = () => {

  const Redirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
      try {
        const token = Cookies.get('token');
        const decodedToken = jwt_decode(token);
        decodedToken.rule === 'chef' ? navigate('/chef') : decodedToken.rule === 'cashier' ? navigate('/cashier/orders/inprogress') : navigate('/dashboard');
      } catch (e) {
        Cookies.remove('token');
        navigate('/login');
      }
    }, [])
    return (
      <></>
    )
  }

  const [navbarIndex, setNavbarIndex] = useState(undefined);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path='chef' element={<Requirechef socket={socket}><Chef socket={socket} /></Requirechef>} />

          <Route path='/' element={<Requireadmin navbarIndex={navbarIndex} socket={socket} />}>
            <Route path="*" element={<Redirect />} />
            <Route path="dashboard" element={<Dashboard setNavbarIndex={setNavbarIndex} />} />

            <Route path="orders">
              <Route path="create" element={<Createorders setNavbarIndex={setNavbarIndex} socket={socket} />} />
              <Route path="inprogress">
                <Route index element={<Inprogress socket={socket} setNavbarIndex={setNavbarIndex} />} />
                <Route path=':id' element={<Inprogresstable setNavbarIndex={setNavbarIndex} socket={socket} />} />
              </Route>
              <Route path="paid" element={<Paid setNavbarIndex={setNavbarIndex} />} />
            </Route>

            <Route path="tables">
              <Route path="add" element={<Addedittable title={'add'} setNavbarIndex={setNavbarIndex} />} />
              <Route path="ve" element={<Vetables setNavbarIndex={setNavbarIndex} />} />
              <Route path="ve/:id" element={<Addedittable title={'edit'} setNavbarIndex={setNavbarIndex} />} />
              <Route path="qr" element={<QR setNavbarIndex={setNavbarIndex} />} />
            </Route>

            <Route path="products">
              <Route path="add" element={<Addeditproduct title={'add'} setNavbarIndex={setNavbarIndex} />} />
              <Route path="ve" element={<Veproducts setNavbarIndex={setNavbarIndex} />} />
              <Route path="ve/:id" element={<Addeditproduct title={'edit'} setNavbarIndex={setNavbarIndex} />} />
            </Route>

            <Route path="managers" element={<Managers setNavbarIndex={setNavbarIndex} />} />

          </Route>

          <Route path="/cashier" element={<Requirecashier navbarIndex={navbarIndex} socket={socket} />}>
            <Route path="orders">
              <Route path="create" element={<Createorders setNavbarIndex={setNavbarIndex} socket={socket} />} />
              <Route path="inprogress">
                <Route index element={<Inprogress socket={socket} setNavbarIndex={setNavbarIndex} />} />
                <Route path=':id' element={<Inprogresstable setNavbarIndex={setNavbarIndex} socket={socket} />} />
              </Route>
            </Route>

            <Route path="tables">
              <Route path="qr" element={<QR setNavbarIndex={setNavbarIndex} />} />
            </Route>
          </Route>

          <Route path="*" element={<Redirect />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;