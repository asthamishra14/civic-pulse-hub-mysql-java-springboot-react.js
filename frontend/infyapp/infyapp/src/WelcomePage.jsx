import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      
      <div className="welcome-left">
        <div className="overlay-text">
          <h1>CivicPulse Hub</h1>
          <h2>Unified Smart City Feedback and Redressal System</h2>
        </div>
      </div>

     
      <div className="welcome-right">
        <div className="welcome-box">
          <h2>Welcome to Civic Hub</h2>
          <p>Your gateway to civic services</p>

          <div className="welcome-buttons">
            <Link to="/register" className="btn register">
              <i className="fas fa-user-plus"></i> Register
            </Link>
            <Link to="/login" className="btn user-login">
              <i className="fas fa-sign-in-alt"></i> User Login
            </Link>
            <Link to="/admin-login" className="btn admin-login">
              <i className="fas fa-user-shield"></i> Admin Login
            </Link>
            <Link to="/department-login" className="btn department-login">
              <i className="fas fa-user-shield"></i> Department Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
