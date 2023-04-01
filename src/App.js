import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Requirechief, Requireadmin } from "./auth/Require";
import { useState } from "react";

import Login from "./pages/Login/Login";
import Chief from "./pages/Chief/Chief";
import Createorders from './pages/Admin/Orders/Createorders/Createorders';
import Navbar from "./components/Navbar/Navbar";
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Inprogress from './pages/Admin/Orders/Inprogress/Inprogress'
import Paid from "./pages/Admin/Orders/Paid/Paid";
import Createtables from "./pages/Admin/Tables/Createtables/Createtables";
import Vetables from "./pages/Admin/Tables/Vetables/Vetables";
import QR from "./pages/Admin/Tables/QR/QR";
import Veproducts from "./pages/Admin/Products/Veproducts/Veproducts";
import Createproducts from './pages/Admin/Products/Createproducts/Createproducts'
import Createusers from "./pages/Admin/Users/Createusers/Createusers";
import Veusers from "./pages/Admin/Users/Veusers/Veusers";
import Inprogresstable from './pages/Admin/Orders/Inprogresstable/Inprogresstable';

const App = () => {

  const [navbarIndex,setNavbarIndex] = useState(0);

  const Withnavbar = ({children})=>{
    return(
      <div style={{display:'flex'}}>
        <Navbar navbarIndex={navbarIndex}/>
        {children}
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path='chief' element={<Requirechief><Chief /></Requirechief>} />

          <Route path="admin" element={<Requireadmin/>}>
            <Route index element={<Withnavbar><Dashboard setNavbarIndex={setNavbarIndex}/></Withnavbar>} />

            <Route path="orders">
              <Route path="create" element={<Withnavbar><Createorders setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              <Route path="inprogress">
                <Route index element={<Withnavbar><Inprogress setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
                <Route path=':id' element={<Withnavbar><Inprogresstable setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              </Route>
              <Route path="paid" element={<Withnavbar><Paid setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
            </Route>

            <Route path="tables">
              <Route path="create" element={<Withnavbar><Createtables setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              <Route path="ve" element={<Withnavbar><Vetables setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              <Route path="qr" element={<Withnavbar><QR setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
            </Route>

            <Route path="products">
              <Route path="create" element={<Withnavbar><Createproducts setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              <Route path="ve" element={<Withnavbar><Veproducts setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
            </Route>

            <Route path="users">
              <Route path="create" element={<Withnavbar><Createusers setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
              <Route path="ve" element={<Withnavbar><Veusers setNavbarIndex={setNavbarIndex}/></Withnavbar>}/>
            </Route>

          </Route>

          <Route path='/*' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
