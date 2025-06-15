import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { BiSolidDashboard } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield } from "react-icons/fa";
import { BsBuildingAdd } from "react-icons/bs";
import { MdLogout } from "react-icons/md"; // Import logout icon
import './Sidebar.css';
import { toast } from 'react-toastify'; 
import api from "../request";

const Sidebar = ({ isCollapsed, toggleSidebar, isDarkMode }) => {
  console.log('Sidebar rendering - isCollapsed:', isCollapsed, 'isDarkMode:', isDarkMode);

  
    
  const navigate = useNavigate();
  const location = useLocation();
  console.log('Current path:', location.pathname);

  const menuItems = [
    {
       name: 'Dashboard',
       icon: <BiSolidDashboard />,
       path: '/Dashboard',
      subItems: []
     },
    {
       name: 'Organization Registration',
       icon: <BsBuildingAdd />,
       path: '/organization-registration',
      subItems: []
     },
    {
       name: 'Account Recovery',
       icon: <FaUserShield />,
       path: '/account-recovery',
      subItems: []
     },
  ];

  const isActive = (path) => {
    const active = location.pathname === path;
    console.log(`Checking if ${path} is active:`, active);
    return active;
  };

  const handleMenuItemClick = (path) => {
    console.log('Menu item clicked, navigating to:', path);
    navigate(path);
  };

  // const handleLogout = () => {
  //   console.log('Logout clicked');
    

  // };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      const response = await api.post('/super-auth/superadmin/auth/logout');
      toast.success('Logged out successfully');
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("username");
      localStorage.removeItem("remember_me")
      navigate('/',{replace: true});
    } catch (error) {
      console.error('Logout error:', error);
      const errorMsg = error?.response?.data?.detail || 'An error occurred during logout';
      toast.error(errorMsg);
    }
  };

  const handleToggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isCollapsed);
    toggleSidebar();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="collapse-button" onClick={handleToggleSidebar}>
        {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
      
      <div className="sidebar-content">
        <ul className="menu-list">
          {menuItems.map((item, index) => {
            console.log(`Rendering menu item ${item.name} with path ${item.path}`);
            return (
              <li
                 key={index}
                 className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item.path)}
              >
                <div className="menu-item-header">
                  <span className="menu-icon">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        
        <div className="logout-section">
          <div className="menu-item logout-item" onClick={handleLogout}>
            <div className="menu-item-header">
              <span className="menu-icon"><MdLogout /></span>
              {!isCollapsed && <span>Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;