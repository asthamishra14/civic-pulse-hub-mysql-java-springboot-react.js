import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TrackComplaint.css";

// helper to safely generate local URL for uploaded files
const getImageUrl = (path) => {
  if (!path) return null;
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return `http://localhost:8082/uploads/${encodeURIComponent(filename)}`;
};

export default function TrackComplaint() {
  const [grievanceId, setGrievanceId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/complaints/track/${grievanceId}`
      );
      setComplaint(response.data);
      setError("");
      // reset feedback form values for new complaint
      setFeedbackText("");
      setRating(0);
      setShowFeedbackModal(false);
    } catch (err) {
      setComplaint(null);
      setError("Complaint not found. Please check your Grievance ID.");
    }
  };

  const openFeedback = () => {
    setFeedbackText(complaint.userFeedback || "");
    setRating(complaint.starRating || 0);
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    if (rating <= 0) {
      alert("Please select a star rating (1-5).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.put(
        `http://localhost:8082/api/complaints/${complaint.id}/feedback`,
        null,
        { params: { feedback: feedbackText, rating } }
      );
      setComplaint(res.data);
      setShowFeedbackModal(false);
      alert("Thank you — feedback submitted!");
    } catch (err) {
      console.error("Feedback submit error:", err);
      alert("Failed to submit feedback. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // star component helpers
  const Star = ({ index }) => {
    return (
      <span
        className={`star ${index <= rating ? "filled" : ""}`}
        onMouseEnter={() => {}}
        onClick={() => setRating(index)}
        style={{ cursor: "pointer", fontSize: 22, marginRight: 6 }}
      >
        ★
      </span>
    );
  };

  return (
    <div className="track-wrapper">
      <div className="track-box">
        <h2>Grievance Tracking</h2>
        <p>Enter your Grievance ID below to check the status of your complaint.</p>

        <div className="track-input-area">
          <input
            type="text"
            value={grievanceId}
            onChange={(e) => setGrievanceId(e.target.value)}
            placeholder="Enter Grievance ID"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <p className="error">{error}</p>}

        {complaint && (
          <div className="result">
            <table>
              <thead>
                <tr>
                  <th>Grievance ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Admin Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{complaint.grievanceId}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.location}</td>
                  <td>
                    <span
                      className={`status ${
                        complaint.status ? complaint.status.toLowerCase() : "pending"
                      }`}
                    >
                      {complaint.status || "Pending"}
                    </span>
                  </td>
                  <td>{complaint.adminComment || "No comment yet"}</td>
                </tr>
              </tbody>
            </table>

            {complaint.mediaPath && (
              <div className="image-section">
                <h4>📸 Uploaded by You:</h4>
                <img
                  src={getImageUrl(complaint.mediaPath)}
                  alt="User Uploaded"
                  className="complaint-image"
                  onClick={() => window.open(getImageUrl(complaint.mediaPath), "_blank")}
                />
              </div>
            )}

            {/* Department proof image (if present) */}
            {complaint.status === "Resolved" && complaint.departmentProofPath && (
              <div className="image-section">
                <h4>✅ Proof Uploaded by Department:</h4>
                <img
                  src={getImageUrl(complaint.departmentProofPath)}
                  alt="Department Proof"
                  className="complaint-image"
                  onClick={() => window.open(getImageUrl(complaint.departmentProofPath), "_blank")}
                />
              </div>
            )}

            {/* Show feedback summary if already submitted */}
            {complaint.feedbackSubmitted && (
              <div style={{ marginTop: 14 }}>
                <b>Your Feedback:</b>
                <div style={{ marginTop: 6 }}>
                  <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ marginRight: 4 }}>
                        {i < (complaint.starRating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>{complaint.userFeedback}</div>
                </div>
              </div>
            )}
{complaint.status.toLowerCase() === "resolved" && (!complaint.userFeedback || complaint.userFeedback === "") && (
  <button onClick={openFeedback}>Give Feedback</button>
)}


            <div style={{ marginTop: 16 }}>
              <button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Submit Feedback</h3>
            <p>Please rate your experience and leave any comments.</p>

            <div style={{ margin: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} index={i + 1} />
                ))}
              </div>
            </div>

            <textarea
              rows="4"
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 6 }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={submitFeedback}
                disabled={submitting}
                style={{ minWidth: 110 }}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
              <button onClick={() => setShowFeedbackModal(false)} className="close-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
