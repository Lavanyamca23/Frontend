import { NavLink } from 'react-router-dom';
import { 
  FaChartBar, FaBoxOpen, FaUserCircle, FaTruck, FaClipboardList, 
  FaBoxes, FaMoneyBill, FaStar, FaBullhorn, FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const navItemStyle = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-purple-800';
  const activeStyle = 'bg-purple-700';

  return (
    <div className="bg-purple-900 text-white min-h-screen w-64 p-4 shadow-lg">
      <h1 className="text-3xl font-bold mb-8 tracking-wider">.cloths</h1>
      <nav className="space-y-2">
        <NavLink to="/ad" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaChartBar className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/UploadProducts" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaBoxOpen className="mr-3" /> Upload Products
        </NavLink>
        <NavLink to="/order" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaClipboardList className="mr-3" /> Orders
        </NavLink>
        {/* <NavLink to="/delivery-tracking" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaTruck className="mr-3" /> Delivery Tracking
        </NavLink>
        <NavLink to="/stocks" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaBoxes className="mr-3" /> Stocks
        </NavLink> */}
        <NavLink to="/expenses" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaMoneyBill className="mr-3" /> Expense
        </NavLink>
        {/* <NavLink to="/reviews" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaStar className="mr-3" /> Reviews & Ratings
        </NavLink> */}
        <NavLink to="/Ads" className={({ isActive }) => `${navItemStyle} ${isActive ? activeStyle : ''}`}>
          <FaBullhorn className="mr-3" /> Advertisement
        </NavLink>
      </nav>
      <div className="absolute bottom-5 w-full">
        <NavLink to="/logout" className={navItemStyle}>
          <FaSignOutAlt className="mr-3" /> Log Out
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
