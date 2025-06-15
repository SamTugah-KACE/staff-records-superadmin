import logo from '../assets/5.png';
import './Footer.css';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`footer ${isDarkMode ? 'dark-mode' : ''}`}>
      <img src={logo} alt="Footer Logo" className="footer-logo" />
      <div className="footer-text">
        Copyright © {new Date().getFullYear()} My Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;