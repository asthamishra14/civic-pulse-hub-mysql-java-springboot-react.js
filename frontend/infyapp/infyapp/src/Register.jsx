import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import "./Register.css";
import "./Form.css";
import axios from "axios";

function Register() {
  const [register, setRegister] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!register.role) {
      alert("Please select a role before registering!");
      return;
    }

    if (register.password !== register.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:8082/addUser", {
        name: register.name,
        email: register.email,
        password: register.password,
        role: register.role,
      });

      // Navigate based on role
      if (register.role === "admin") {
        navigate("/admin-login");
      } else if (register.role === "people") {
        navigate("/login");
      } else {
        navigate("/department-login");
      }
    } catch (error) {
      console.log(error);
      alert("Registration failed. Try again!");
    }
  };

  //  Handle login navigation based on role
  const handleLoginRedirect = () => {
    if (register.role === "admin") {
      navigate("/admin-login");
    } else if (register.role === "people") {
      navigate("/login");
    } else if (register.role) {
      navigate("/department-login");
    } else {
      // If no role selected, show a prompt
      alert("Please select your role from the dropdown before logging in.");
    }
  };

  return (
    <div className="register-container">
      {/* Left Half */}
      <div className="register-left">
        <div className="register-overlay-text">
          <FaUserPlus className="register-icon" />
          <h1>Register for CivicPulse Hub</h1>
          <p>Join the Smart City Feedback & Redressal System</p>
        </div>
      </div>

      {/* Right Half */}
      <div className="register-right">
        <div className="register-box">
          <h2>
            <FaUserPlus /> Register
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Role Dropdown */}
            <label>Register As:</label>
            <select
              name="role"
              value={register.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="people">People</option>
              <option value="water">Water Department</option>
              <option value="eb">EB Department</option>
              <option value="road">Road Department</option>
              <option value="transport">Transport Department</option>
              <option value="sanitation">Sanitation Department</option>
              <option value="infrastructure">Infrastructure Department</option>
              <option value="traffic">Traffic Department</option>
              <option value="other">Other Department</option>
            </select>

            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={register.name}
              onChange={handleChange}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={register.email}
              onChange={handleChange}
              required
            />

            <label>Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={register.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <label>Confirm Password:</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={register.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button type="submit">
              <FaUserPlus /> Register
            </button>

            <p>
              Already registered?{" "}
              <span onClick={handleLoginRedirect} style={{ cursor: "pointer" }}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
























