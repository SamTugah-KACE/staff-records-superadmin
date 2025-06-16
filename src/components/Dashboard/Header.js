import logo from '../assets/image-1.png';
import { IoSunny, IoMoon } from "react-icons/io5";
import './Header.css';

const Header = ({ toggleDarkMode, isDarkMode }) => {


  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="company logo" />
      
      <div className="header-text">GHANA-INDIA KOFI ANNAN CENTRE OF EXCELLENCE IN ICT</div>
      
      <div className="header-controls">
        <button 
          className="theme-toggle-button" 
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <IoSunny className="theme-icon" />
          ) : (
            <IoMoon className="theme-icon" />
          )}
        </button>

        
      </div>
    </header>
  );
};

export default Header;