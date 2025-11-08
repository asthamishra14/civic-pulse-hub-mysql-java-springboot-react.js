import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa"; // Added icon
import "./Login.css";
import "./Form.css";

function Login() {
  const navigate = useNavigate();
  const [password, setPasswordValue] = useState("");
  const [userId, setUserIdValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const setPassword = (e) => setPasswordValue(e.target.value);
  const setUserId = (e) => setUserIdValue(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { userId, password };

    try {
      const response = await axios.post("http://localhost:8082/loginUser", data);

      if (!response.data) {
        alert("Invalid User Id or Password");
      } else {
        alert("Login Successful");

        const registeredUser = JSON.parse(localStorage.getItem(userId));
        if (registeredUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: registeredUser.name,
              email: registeredUser.email,
            })
          );
        }

        navigate("/layout");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  const redirectToRegister = () => navigate("/register");

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <FaUserShield className="login-icon" />
        <h1 className="login-heading">User Login</h1>
        <p>Welcome back! Please login to access your dashboard.</p>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-box">
          <h2>👤 Login</h2>

          <label>User ID:</label>
          <input
            type="email"
            placeholder="Enter your user id"
            value={userId}
            onChange={setUserId}
            required
          />

          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="links">
            <span>Don't have an account? </span>
            <span
              onClick={redirectToRegister}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Register
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
