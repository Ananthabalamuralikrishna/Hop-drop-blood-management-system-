import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Button from "./Button";
import "./Navbar.css";

function Navbar({ showHome = false }) {
  const navigate = useNavigate();

  const appContext = useAppContext() || {};

  const auth = appContext?.auth || {};
  const logout = appContext?.actions?.logout || (() => { });

  const isLoggedIn = auth.isAuthenticated;

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleDonateClick = () => {
    navigate("/donate");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-left" onClick={handleLogoClick}>
        <div className="navbar-logo-circle">
          <img
            src="/logo.png"
            alt="Hope Drop logo"
            className="navbar-logo-img"
          />
        </div>
      </div>

      {/* Center Title */}
      <div className="navbar-center" onClick={handleLogoClick}>
        <div className="navbar-title">Hope Drop</div>
        <div className="navbar-quote">
          A single drop of blood can create a river of hope.
        </div>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {showHome && (
          <button
            type="button"
            className="nav-home-btn"
            onClick={handleLogoClick}
          >
            Home
          </button>
        )}

        {/* Donate Blood pill button — always visible */}
        <button
          type="button"
          className="nav-donate-btn"
          onClick={handleDonateClick}
        >
           Donate 🩸 
        </button>

        {isLoggedIn && (
          <Button
            variant="secondary"
            onClick={handleLogout}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
