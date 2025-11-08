import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DepartmentLogin.css";

const DepartmentLogin = () => {
  const navigate = useNavigate();

  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId: departmentId,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:8082/api/department/login", data);

      if (!response.data) {
        alert("Invalid Department ID or Password");
      } else {
        alert(`✅ ${departmentName} Department Login Successful`);
        localStorage.setItem("departmentName", departmentName);
        navigate("/department-dashboard", { state: { departmentName } });
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="department-login-container">
      {/* Left Info Section */}
      <div className="department-info">
        <FaBuilding className="dept-icon" />
        <h2>Department Login</h2>
        <p>
          Secure access for all municipal and government departments. 
          Please login with your unique ID and password.
        </p>
      </div>

      {/* Right Form Section */}
      <div className="department-login-card">
        <h2><FaBuilding style={{ marginRight: "8px" }} /> Department Portal</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dept">Department:</label>
            <select
              id="dept"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="EB Department">EB Department</option>
              <option value="Water Department">Water Department</option>
              <option value="Road Department">Road Department</option>
              <option value="Transport Department">Transport Department</option>
              <option value="Sanitation Department">Sanitation Department</option>
              <option value="Infrastructure Department">Infrastructure Department</option>
              <option value="Traffic Department">Traffic Department</option>
              <option value="Other Department">Other Department</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="deptId">Department ID:</label>
            <input
              id="deptId"
              type="text"
              placeholder="Enter Department ID"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper">
              <input
                id="password"
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
  );
};

export default DepartmentLogin;
