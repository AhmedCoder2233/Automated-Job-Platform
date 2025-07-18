"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">JobConnect</h1>
          <span className="logo-tagline">Hire & Get Hired</span>
        </div>

        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item"><a href="#jobs">Browse Jobs</a></li>
            <li className="nav-item"><a href="#post">Post a Job</a></li>
            <li className="nav-item"><Link to="/interview">Interview Section</Link></li>
            <li className="nav-item"><Link to="/admin-panel">Admin-Panel</Link></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn btn-signup">Sign Up</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="btn btn-login">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button className="mobile-menu-btn">
          <span className="menu-icon-bar"></span>
          <span className="menu-icon-bar"></span>
          <span className="menu-icon-bar"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
