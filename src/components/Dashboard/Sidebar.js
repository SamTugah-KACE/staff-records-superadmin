import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { BiSolidDashboard } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield } from "react-icons/fa";
import { BsBuildingAdd } from "react-icons/bs";
import { MdLogout } from "react-icons/md"; // Import logout icon
import './Sidebar.css';
import { toast } from 'react-toastify'; 
import request from "../request";
import { blockBackButton } from './historyBlocker';

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

    const LOGOUT_CONFIRMATION_MESSAGE = 'Are you sure you want to logout?';
  const AUTH_KEYS_TO_REMOVE = [
    'access_token',
    'token_type', 
    'username',
    'login_timestamp',
    'remember_me'
  ];
  const LOGOUT_REDIRECT_PATH = '/';
    const HISTORY_BARRIER_COUNT = 10;

    const clearAuthStorage = () => {
    AUTH_KEYS_TO_REMOVE.forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
  };


    const createHistoryBarrier = () => {
    for (let i = 0; i < HISTORY_BARRIER_COUNT; i++) {
      window.history.pushState(null, '', LOGOUT_REDIRECT_PATH);
    }
  };

  const handleLogoutPopState = (event) => {
    window.history.pushState(null, '', LOGOUT_REDIRECT_PATH);
    toast.info('Please log in to access the application');
    if (window.location.pathname !== LOGOUT_REDIRECT_PATH) {
      window.location.replace(LOGOUT_REDIRECT_PATH);
    }
  };            

  const cleanupPopStateHandlers = () => {
    window.onpopstate = null;
    if (window.logoutPopstateHandlers) {
      window.logoutPopstateHandlers.forEach(handler => {
        window.removeEventListener('popstate', handler);
      });
    }
  };


  // Call this right AFTER any replace‑style navigation
  // const disableBackButton = () => {
  //   // push a dummy entry so we can trap “popstate”
  //   window.history.pushState(null, '', window.location.href);
  //   window.onpopstate = () => {
  //     // prevent going back
  //     window.history.go(1);
  //   };
  // };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try{
const response = await request.post('/super-auth/superadmin/auth/logout');
      console.log("logout response: ", response.status);
    }catch (logoutError) {
        console.error('Server logout error:', logoutError);
      }

    try {
    //   const response = await request.post('/super-auth/superadmin/auth/logout');
    //   console.log("logout response: ", response.status);
     
    //  if(response.status === 204 || response.status===200){
     
    //  localStorage.removeItem("access_token");
    //   localStorage.removeItem("token_type");
    //   localStorage.removeItem("username");
    //   localStorage.removeItem("remember_me")
     clearAuthStorage();
      toast.success('Logged out successfully');

      // History management
      window.history.replaceState(null, '', LOGOUT_REDIRECT_PATH);
      createHistoryBarrier();
      
      // Event handler setup
      cleanupPopStateHandlers();
      window.addEventListener('popstate', handleLogoutPopState);
      window.logoutPopstateHandlers = [handleLogoutPopState];

      // Redirect
      window.location.replace(LOGOUT_REDIRECT_PATH);

      // window.location.href = "/";
      // disableBackButton();
      // do a full reload to the domain root:
      // window.location.replace(window.location.origin + '/');
      toast.success('Logged out successfully');
      navigate('/',{replace: true});
      blockBackButton();
    //  }else{
    //   console.log("logout error response.data:: ", response.data);
    //  }
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