import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import TrackUpdatesModal from "./TrackUpdatesModal";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState("All");
  const [assigning, setAssigning] = useState({});
  const [resolutionDays, setResolutionDays] = useState({}); // ✅ added missing state
  const [trackModalComplaintId, setTrackModalComplaintId] = useState(null);
  const navigate = useNavigate();


  const departments = [
    "EB Department",
    "Water Department",
    "Road Department",
    "Transport Department",
    "Sanitation Department",
    "Infrastructure Department",
    "Traffic Department",
    "Other Department",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/complaints/all")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  const refresh = () => {
    axios
      .get("http://localhost:8082/api/complaints/all")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
    axios
      .put(
        `http://localhost:8082/api/complaints/${id}/status?status=${newStatus}`
      )
      .then((res) =>
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        )
      )
      .catch((err) => console.error("Error updating status:", err));
  };

  const handleAssign = (id) => {
    const dept = assigning[id];
    const days = resolutionDays[id]; // ✅ safely using resolutionDays
    if (!dept) {
      alert("Please select a department first!");
      return;
    }
    if (!days || isNaN(days) || days <= 0) {
      alert("Please enter valid resolution days!");
      return;
    }
    axios
      .put(`http://localhost:8082/api/complaints/${id}/assign`, null, {
        params: { department: dept, resolutionDays: days },
      })
      .then((res) => {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        );
        alert(`✅ Complaint assigned to ${dept} (Resolve in ${days} days)`);
      })
      .catch((err) => console.error("Error assigning complaint:", err));
  };

  // Reassign after bad feedback
  const handleReassignFromFeedback = (complaint) => {
    let dept = complaint.assignedDepartment;
    if (!dept) {
      dept = prompt(
        "Enter department to reassign to (e.g. 'EB Department'):"
      );
      if (!dept) {
        return;
      }
    }
    axios
      .put(`http://localhost:8082/api/complaints/${complaint.id}/assign`, null, {
        params: { department: dept },
      })
      .then((res) => {
        alert("Complaint reassigned to " + dept);
        refresh();
      })
      .catch((err) => {
        console.error("Reassign error:", err);
        alert("Failed to reassign. Try again.");
      });
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return null;
    const parts = mediaPath.split("/");
    const filename = parts[parts.length - 1];
    return `http://localhost:8082/uploads/${encodeURIComponent(filename)}`;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="cards-container">
        <div className="card" onClick={() => setFilter("All")}>
          📋 Total: {total}
        </div>
        <div className="card" onClick={() => setFilter("Pending")}>
          ⏱️ Pending: {pending}
        </div>
        <div className="card" onClick={() => setFilter("Resolved")}>
          🎯 Resolved: {resolved}
        </div>
        <div className="card analytics-card" onClick={() => navigate("/admin/reports")}>
          📊 Reports / Analytics
        </div>
      </div>

      <table className="complaints-table">
        <thead>
          <tr>
            <th>Grievance ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Status</th>
            <th>Assign Dept + Days</th>
            <th>Action</th>
            <th>Dept Updates</th>
            <th>Rating</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((c) => (
              <tr
                key={c.id}
                onClick={(e) => {
                  if (
                    ["BUTTON", "SELECT", "OPTION", "IMG", "INPUT"].includes(
                      e.target.tagName
                    )
                  )
                    return;
                  setSelectedComplaint(c);
                }}
              >
                <td>{c.grievanceId}</td>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>{c.location}</td>
                <td>
                  <span
                    className={`status-badge ${
                      c.status === "Resolved" ? "resolved" : "pending"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td>
                  {c.assignedDepartment ? (
                    <span>
                      {c.assignedDepartment}
                      {c.dueDate && (
                        <small> (Due: {c.dueDate})</small>
                      )}
                    </span>
                  ) : (
                    <>
                      <select
                        value={assigning[c.id] || ""}
                        onChange={(e) =>
                          setAssigning((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="Days"
                        className="days-input"
                        value={resolutionDays[c.id] || ""}
                        onChange={(e) =>
                          setResolutionDays((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />

                      <button
                        className="assign-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssign(c.id);
                        }}
                      >
                        Assign
                      </button>
                    </>
                  )}
                </td>

                <td>
                  <button
                    className={
                      c.status === "Pending"
                        ? "resolve-btn"
                        : "pending-btn"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(c.id, c.status);
                    }}
                  >
                    {c.status === "Pending" ? "Resolve" : "Mark Pending"}
                  </button>
                </td>

                <td>
                  <button
                    className="track-updates-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrackModalComplaintId(c.id);
                    }}
                  >
                    Track Updates
                  </button>
                </td>

                <td style={{ textAlign: "center" }}>
                  {c.starRating ? (
                    <span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < c.starRating ? "★" : "☆"}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td
                  style={{
                    maxWidth: 240,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.userFeedback ? c.userFeedback : "-"}
                  {c.starRating && c.starRating <= 2 && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        style={{
                          background: "#d9534f",
                          color: "white",
                          padding: "6px 10px",
                          borderRadius: 6,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReassignFromFeedback(c);
                        }}
                      >
                        Reassign
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedComplaint.title}</h2>
            <p>
              <b>Grievance ID:</b> {selectedComplaint.grievanceId}
            </p>
            <p>
              <b>Category:</b> {selectedComplaint.category}
            </p>
            <p>
              <b>Location:</b> {selectedComplaint.location}
            </p>
            <p>
              <b>Description:</b> {selectedComplaint.description}
            </p>
            <p>
              <b>Status:</b> {selectedComplaint.status}
            </p>
            <p>
              <b>Assigned Department:</b>{" "}
              {selectedComplaint.assignedDepartment || "Not Assigned"}
            </p>

            {selectedComplaint.mediaPath && (
              <div>
                <b>Attachment:</b>
                <img
                  src={getMediaUrl(selectedComplaint.mediaPath)}
                  alt="Evidence"
                  style={{
                    maxWidth: "100%",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const url = getMediaUrl(selectedComplaint.mediaPath);
                    window.open(url, "_blank");
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: "15px" }}>
              <b>Admin Comment:</b>
              <textarea
                rows="3"
                style={{ width: "100%", marginTop: "5px" }}
                value={selectedComplaint.adminComment || ""}
                onChange={(e) =>
                  setSelectedComplaint({
                    ...selectedComplaint,
                    adminComment: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="resolve-btn"
              style={{ marginTop: "10px" }}
              onClick={() => {
                axios
                  .put(
                    `http://localhost:8082/api/complaints/${selectedComplaint.id}/status`,
                    null,
                    {
                      params: {
                        status:
                          selectedComplaint.status === "Pending"
                            ? "Resolved"
                            : "Pending",
                        comment: selectedComplaint.adminComment || "",
                      },
                    }
                  )
                  .then((res) => {
                    setComplaints((prev) =>
                      prev.map((c) =>
                        c.id === selectedComplaint.id ? res.data : c
                      )
                    );
                    setSelectedComplaint(res.data);
                  })
                  .catch((err) =>
                    console.error("Error saving comment:", err)
                  );
              }}
            >
              Save Changes
            </button>

            <button
              className="close-btn"
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {trackModalComplaintId && (
        <TrackUpdatesModal
          complaintId={trackModalComplaintId}
          onClose={() => setTrackModalComplaintId(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
