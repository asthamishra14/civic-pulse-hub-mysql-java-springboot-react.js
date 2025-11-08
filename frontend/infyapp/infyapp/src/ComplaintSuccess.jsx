import { useNavigate } from "react-router-dom";
import "./ComplaintSuccess.css";

export default function ComplaintSuccess({ grievanceId }) {
  const navigate = useNavigate();

  return (
    <div className="success-wrapper">
      <div className="success-box">
        <h2>Submit a Complaint</h2>
        <p className="success-msg">
          Complaint submitted successfully! Please note your Grievance ID.
        </p>
        <p className="grievance-id">
          Your Grievance ID: <span>{grievanceId}</span>
        </p>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
