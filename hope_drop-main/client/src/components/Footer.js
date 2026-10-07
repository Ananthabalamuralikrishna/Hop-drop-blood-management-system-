import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section">
          <h4>Hope Drop</h4>
          <p className="footer-tagline">
            Blood Bank Management System
          </p>
          <p>
            Hope Drop connects donors, hospitals, and patients
            during emergency situations to save lives.
          </p>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h4>About</h4>
          <p>
            Built using the MERN stack to simplify blood donation
            and make emergency blood requests faster and more reliable.
          </p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:hopedropbb@gmail.com?subject=Blood Bank Inquiry&body=Hello, I would like to know about...">hopedropbb@gmail.com</a></p>
          <p>Emergency Helpline: 102</p>
          <p>Ambulance: 108</p>
        </div>

        {/* Quick Links */}
        {/*<div className="footer-section">
          <h4>Quick Links</h4>
          <p>Donate Blood</p>
          <p>Find Donors</p>
          <p>Emergency Request</p>
        </div>*/}

      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Hope Drop Blood Bank Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
