import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";


import "./AdminReports.css";

function AdminReports() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/complaints/all")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  // ----- Chart 1: Complaints by Category -----
  const complaintsByCategory = complaints.reduce((acc, c) => {
    if (c.category) {
      acc[c.category] = (acc[c.category] || 0) + 1;
    }
    return acc;
  }, {});
  const categoryData = Object.entries(complaintsByCategory).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2", "#D65DB1", "#FF6F91"];

  // ----- Chart 2: SLA Performance (Based on dueDate vs completionDate) -----
  const slaData = complaints
    .filter((c) => c.assignedDepartment && c.dueDate && c.completionDate)
    .reduce((acc, c) => {
      const dep = c.assignedDepartment;
      const isOnTime = new Date(c.completionDate) <= new Date(c.dueDate);

      if (!acc[dep]) acc[dep] = { department: dep, OnTime: 0, Delayed: 0 };
      if (isOnTime) acc[dep].OnTime += 1;
      else acc[dep].Delayed += 1;

      return acc;
    }, {});
  const slaChartData = Object.values(slaData);

  // ----- Chart 3: Complaints by Zone/Location -----
  const locationData = complaints.reduce((acc, c) => {
    if (c.location) {
      acc[c.location] = (acc[c.location] || 0) + 1;
    }
    return acc;
  }, {});
  const zoneData = Object.entries(locationData).map(([name, value]) => ({ name, value }));

  return (
    <div className="reports-container">
      <h1 className="reports-title">📈 Analytics & Reports</h1>
      <button className="back-btn" onClick={() => (window.location.href = "/admin-dashboard")}>
        ← Back to Dashboard
      </button>

      {/* ----- Pie Chart: Complaints by Category ----- */}
      <div className="chart-card">
        <h2>Complaints by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* sla performance/point chart */}
<div className="chart-card">
  <h2>SLA Performance by Department (Points Based)</h2>
  <ResponsiveContainer width="100%" height={380}>
    <BarChart
      data={slaChartData.map((item) => ({
        ...item,
        points: item.OnTime * 10 - item.Delayed * 5, // SLA points
        totalComplaints: item.OnTime + item.Delayed,
      }))}
      margin={{ top: 40, right: 30, left: 2, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="department"
        tickFormatter={(value, index) => {
          const dept = slaChartData[index];
          const total = dept.OnTime + dept.Delayed;
          return `${value} (${total})`;
        }}
      />
      <YAxis
        label={{
          value: "Complaints / SLA Points",
          angle: -90,
          position: "insideLeft",
          style: { textAnchor: "middle" },
        }}
      />
      <Tooltip
        formatter={(value, name) => {
          if (name === "OnTime") return [`${value} Complaints`, "On Time" ];
          if (name === "Delayed") return [`${value} Complaints`, "Delayed"];
          if (name === "points") return [`${value} Points`, "SLA Points"];
          return [value, name];
        }}
      />
      <Legend />
       

      {/* On-Time Complaints */}
      <Bar dataKey="OnTime" name="On Time Complaints"fill="#10875bff">
        {slaChartData.map((entry, index) => {
          const colors = [
            "#00C49F", "#0088FE", "#FFBB28", "#FF8042",
            "#845EC2", "#FF6F91", "#D65DB1",
          ];
          return <Cell key={`on-${index}`} fill={colors[index % colors.length]} />;
        })}
      </Bar>

      {/* Delayed Complaints */}
      <Bar dataKey="Delayed" name="Delayed Complaints"fill="#f4602bff" >
        {slaChartData.map((entry, index) => {
          const colors = [
            "#66CDAA", "#5DADE2", "#F7DC6F", "#F5B041",
            "#B39DDB", "#F1948A", "#E8A2C8",
          ];
          return <Cell key={`delay-${index}`} fill={colors[index % colors.length]} />;
        })}
      </Bar>

      
      <Bar
        dataKey="points"
        name="SLA Points"
        barSize={35}
        label={{ position: "top", fill: "#000" }}
      >
        {slaChartData.map((entry, index) => {
          const value = entry.OnTime * 10 - entry.Delayed * 5;
          return (
            <Cell
              key={`points-${index}`}
              fill={value >= 0 ? "#10875bff" : "#f54429ff"} 
            />
          );
        })}
      </Bar>
    </BarChart>
  </ResponsiveContainer>

  {/*  Total Net Score Display */}
  <div
    style={{
      textAlign: "right",
      marginTop: "8px",
      fontWeight: "bold",
      backgroundColor: "#e0f3f6",
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "5px",
    }}
  >
    Total Net Score:{" "}
    <span style={{ color: "#00707c" }}>
      {slaChartData
        .map((item) => item.OnTime * 10 - item.Delayed * 5)
        .reduce((a, b) => a + b, 0)}
    </span>
  </div>
</div>


{/* Complaint Zones Heatmap */}
<div className="chart-card">
  <h2>Complaint Density by Zone</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={zoneData}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />

      <Bar dataKey="value" label={{ position: "top" }}>
        {zoneData.map((entry, index) => {
          const max = Math.max(...zoneData.map((z) => z.value));
          const ratio = entry.value / max;

          // Interpolate color: yellow → orange → red
          let color;
          if (ratio > 0.75) color = "#ff4d4d"; 
          else if (ratio > 0.4) color = "#ff9933"; 
          else color = "#ffff66"; 

          return <Cell key={`cell-${index}`} fill={color} />;
        })}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
</div>  
  );
}

export default AdminReports;



