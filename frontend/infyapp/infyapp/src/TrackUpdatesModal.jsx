import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrackUpdatesModal.css"; 

function TrackUpdatesModal({ complaintId, onClose }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!complaintId) return;
    axios
      .get(`http://localhost:8082/api/complaint-updates/${complaintId}`)
      .then((res) => setUpdates(res.data))
      .catch((err) => console.error("Error fetching updates:", err));
  }, [complaintId]);

  return (
    <div className="track-modal-overlay" onClick={onClose}>
      <div className="track-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Department Updates — Grievance #{complaintId}</h3>
        {updates.length === 0 ? (
          <p>No updates from departments yet.</p>
        ) : (
          <table className="updates-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Dept</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id}>
                  <td>{new Date(u.updatedAt).toLocaleString()}</td>
                  <td>{u.departmentName}</td>
                  <td>{u.status}</td>
                  <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{u.comment || "—"}</td>
                  <td>
                    {u.proofPath ? (
                      <a href={`http://localhost:8082${u.proofPath}`} target="_blank" rel="noreferrer">
                        <img src={`http://localhost:8082${u.proofPath}`} alt="proof" style={{ width: 80, height: 60, objectFit: "cover" }} />
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
}

export default TrackUpdatesModal;
