import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";
import "./Form.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      adminId: adminId,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/api/admin/login",
        data
      );

      if (!response.data) {
        alert("Invalid Admin ID or Password");
      } else {
        alert("✅ Admin Login Successful");
        navigate("/admin-dashboard"); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Left half */}
      <div className="admin-login-left">
        <FaUserCog className="admin-icon" />
        <h1>Admin Login</h1>
        <p>
          Secure access for administrators to manage complaints,
          monitor pending cases, and ensure quick resolutions.
        </p>
      </div>

      {/* Right half (form) */}
      <div className="admin-login-right">
        <div className="admin-login-card">
          <form onSubmit={handleSubmit}>
            <h2>🛡️Admin Login</h2>
            <div className="form-group">
              
              <label>Admin ID:</label>
              <input
                type="text"
                placeholder="Enter Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label>Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

