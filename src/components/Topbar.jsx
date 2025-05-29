import { FaBell, FaEnvelope } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <input
        type="text"
        placeholder="Search..."
        className="p-2 border rounded-md w-1/3"
      />
      <div className="flex items-center space-x-4">
        <FaEnvelope />
        <FaBell />
        <span>Hi, Admin</span>
      </div>
    </div>
  );
};

export default Topbar;
