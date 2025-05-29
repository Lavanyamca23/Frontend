import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UploadProducts from './pages/UploadProducts';
// import EditProduct from './pages/EditProduct';
import OrdersPage from './pages/OrdersPage';
import OrdersList from './pages/OrdersList';
import ExpensesPage from './pages/ExpensesPage';
import AdvertisementList from './pages/AdvertisementList';
import OrderPage from './pages/Order';


const About = () => <div className="p-6 text-lg">About Page Coming Soon...</div>;
const Login = () => <div className="p-6 text-lg">Login Page Coming Soon...</div>;

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/ad" element={<AdminDashboard />} />
        <Route path="/UploadProducts" element={<UploadProducts />} />
         {/* <Route path="/edit-product/:id" element={<EditProduct/>}/> */}
        <Route path="/order" element={<OrdersPage/>}/>
       <Route path="/orderlist" element={<OrdersList/>}/>
        <Route path="/expenses" element={<ExpensesPage/>}/>
        <Route path="/Ads" element={<AdvertisementList/>}/>
        <Route path="/orderpage" element={<OrderPage/>}/>


      </Routes>
    </Router>
  );
};

export default App;
