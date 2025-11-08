  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import WelcomePage from "./WelcomePage";
  import Register from "./register";
  import Login from "./login";
  import Layout from "./layout";
  import Dashboard from "./Dashboard";
  import SubmitComplaint from "./SubmitComplaint";
  import ComplaintSuccess from "./ComplaintSuccess"; 
  import TrackComplaint from "./TrackComplaint";
  import AdminLogin from "./AdminLogin";
  import AdminDashboard from "./AdminDashboard";
  import AdminReports from "./AdminReports";
  import DepartmentLogin from "./DepartmentLogin";
  import DepartmentDashboard from "./DepartmentDashboard";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/WelcomePage" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/ComplaintSuccess" element={<ComplaintSuccess />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/department-login" element={<DepartmentLogin />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />
      </Routes>
    );
  }

 export default App;



