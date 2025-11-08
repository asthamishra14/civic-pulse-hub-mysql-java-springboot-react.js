import { FaRegEdit } from "react-icons/fa";   
import { MdOutlineTrackChanges } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
  <div className="bubble top-right"></div>
  <div className="bubble bottom-left"></div>


      <div className="dashboard">
        <h2>CivicPulse Complaint Dashboard</h2>
        <p>Submit complaints or track existing complaints efficiently.</p>

        <div className="dashboard-cards">
          {/* Submit Complaint Card */}
          <div
            className="dashboard-card submit"
            onClick={() => navigate("/submit-complaint")}
          >
            <span className="icon"><FaRegEdit /></span>
            <h3>Submit Complaint</h3>
            <p>Fill in your complaint details quickly and easily.</p>
          </div>

          {/* Track Complaint Card */}
          <div
            className="dashboard-card track"
            onClick={() => navigate("/track-complaint")}
          >
            <span className="icon"><MdOutlineTrackChanges /></span>
            <h3>Track Complaint</h3>
            <p>View all complaints and their current status.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
