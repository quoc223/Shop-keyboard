
import React  from 'react';
import Homepage from './components/homepage/index';
import ResponsiveAppBar from './components/header';
 import Footer from './components/footer';
//import Product from './components/productpage/index';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetailProduct from './components/productpage/detailproduct';
import LoginPage from './components/login';
import ShoppingCart from './components/productpage/shopingcart';
import Admin from './components/admin/admin';
import OrderList from './components/admin/managerorder';
function App() {
  return (
    <>   
     <Router>
      <div className="app-container">
        <ResponsiveAppBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/keyboard" element={<h1>Keyboard</h1>} />
            <Route path="/kit-ban-phim" element={<h1>Kit Bàn Phím</h1>} />
            <Route path="/mouse" element={<h1>Mouse</h1>} />
            <Route path="/keycap" element={<h1>Keycap</h1>} />
            <Route path="/switch" element={<h1>Switch</h1>} />

            <Route path="/orderlist" element={<OrderList />} />
            <Route path="/dasdboar" element={< Admin/>} />
            <Route path="/order" element={<ShoppingCart/>} />
            <Route path="/product/:productId" element={<DetailProduct />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </>
  );
}

export default App;
