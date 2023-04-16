import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Requirechief, Requireadmin } from "./auth/Require";
import { useState } from "react";

import Login from "./pages/Login/Login";
import Chief from "./pages/Chief/Chief";
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
<<<<<<< HEAD
import { Ws } from './api/socketLink';
import io from 'socket.io-client';
const socket = io(Ws);
=======
// import { Ws } from './api/socketLink';
// import io from 'socket.io-client';
// const socket = io(Ws);
>>>>>>> f0c3d51454af0a603879202753cbd5c1ac1e2882

const App = () => {

  const [navbarIndex, setNavbarIndex] = useState(undefined);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

<<<<<<< HEAD
          <Route path='chief' element={<Requirechief socket={socket}><Chief socket={socket} /></Requirechief>} />

          <Route path="admin" element={<Requireadmin navbarIndex={navbarIndex} socket={socket} />}>
=======
          <Route path='chief' element={<Requirechief><Chief /></Requirechief>} />

          <Route path="admin" element={<Requireadmin navbarIndex={navbarIndex} />}>
>>>>>>> f0c3d51454af0a603879202753cbd5c1ac1e2882
            <Route index element={<Dashboard setNavbarIndex={setNavbarIndex} />} />

            <Route path="orders">
              <Route path="create" element={<Createorders setNavbarIndex={setNavbarIndex} />} />
              <Route path="inprogress">
<<<<<<< HEAD
                <Route index element={<Inprogress socket={socket} setNavbarIndex={setNavbarIndex} />} />
=======
                <Route index element={<Inprogress setNavbarIndex={setNavbarIndex} />} />
>>>>>>> f0c3d51454af0a603879202753cbd5c1ac1e2882
                <Route path=':id' element={<Inprogresstable setNavbarIndex={setNavbarIndex} />} />
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

          <Route path='/*' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
