import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Chuwa Market</h3>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
        <div className="footer-icons">
          <a href="#"><img src="/icons/facebook.svg" alt="Facebook" /></a>
          <a href="#"><img src="/icons/twitter.svg" alt="Twitter" /></a>
          <a href="#"><img src="/icons/instagram.svg" alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;