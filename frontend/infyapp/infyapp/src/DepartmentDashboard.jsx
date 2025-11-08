// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import "./DepartmentDashboard.css";

// function DepartmentDashboard() {
//   const location = useLocation();
//   const departmentName =
//     location.state?.departmentName || localStorage.getItem("departmentName") || "Department";

//   const [workers, setWorkers] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [workerNameInput, setWorkerNameInput] = useState("");
//   const [workerContactInput, setWorkerContactInput] = useState("");
//   const [selectedWorkers, setSelectedWorkers] = useState([]); // multiple
//   const [photo, setPhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [comment, setComment] = useState("");
//   const [status, setStatus] = useState("In Progress");

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8082/api/workers/${departmentName}`)
//       .then((res) => setWorkers(res.data))
//       .catch((err) => console.error("Error fetching workers:", err));
//   }, [departmentName]);

//   useEffect(() => {
//     if (!departmentName) return;
//     axios
//       .get(`http://localhost:8082/api/complaints/department/${departmentName}`)
//       .then((res) => setComplaints(res.data))
//       .catch((err) => console.error("Error fetching complaints:", err));
//   }, [departmentName]);

//   const handleAddWorker = (e) => {
//     e.preventDefault();
//     if (!workerNameInput || !workerContactInput) {
//       alert("Please fill all fields");
//       return;
//     }
//     axios
//       .post("http://localhost:8082/api/workers/add", {
//         department: departmentName,
//         name: workerNameInput,
//         contact: workerContactInput,
//       })
//       .then((res) => {
//         setWorkers([...workers, res.data]);
//         setWorkerNameInput("");
//         setWorkerContactInput("");
//       })
//       .catch((err) => console.error("Error adding worker:", err));
//   };

//   const toggleWorkerSelection = (name) => {
//     const exists = selectedWorkers.includes(name);
//     if (exists) {
//       setSelectedWorkers(selectedWorkers.filter((w) => w !== name));
//       return;
//     }
//     if (selectedWorkers.length >= 4) {
//       alert("You can select up to 4 workers only.");
//       return;
//     }
//     setSelectedWorkers([...selectedWorkers, name]);
//   };

//   const handlePhotoChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setPhoto(f);
//     const url = URL.createObjectURL(f);
//     setPhotoPreview(url);
//   };

//   // construct URL for images saved as /uploads/<filename>
//   const getMediaUrl = (mediaPath) => {
//     if (!mediaPath) return null;
//     const parts = mediaPath.split("/");
//     const filename = parts[parts.length - 1];
//     return `http://localhost:8082/uploads/${encodeURIComponent(filename)}`;
//   };

//   const handleUpdateComplaint = (id) => {
//     const formData = new FormData();
//     const workersString = selectedWorkers.join(", ");
//     formData.append("workerName", workersString);
//     formData.append("status", status);
//     formData.append("comment", comment);
//     if (photo) formData.append("photo", photo);

//     axios
//       .put(`http://localhost:8082/api/complaints/${id}/update-by-department`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then((res) => {
//         alert("Complaint updated successfully!");
//         setComplaints((prev) => prev.map((c) => (c.id === id ? res.data : c)));
//         setSelectedComplaint(null);
//         setPhoto(null);
//         setPhotoPreview(null);
//         setSelectedWorkers([]);
//         setComment("");
//         setStatus("In Progress");
//       })
//       .catch((err) => {
//         console.error("Error updating complaint:", err);
//         alert("Update failed. Try again.");
//       });
//   };

//   return (
//     <div className="dept-dashboard-container">
//       <h1 className="dept-dashboard-title">{departmentName} Dashboard</h1>

//       <div className="dept-section">
//         <h2>👷 Add Workers</h2>
//         <form className="worker-form" onSubmit={handleAddWorker}>
//           <input
//             type="text"
//             placeholder="Worker Name"
//             value={workerNameInput}
//             onChange={(e) => setWorkerNameInput(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Contact Number"
//             value={workerContactInput}
//             onChange={(e) => setWorkerContactInput(e.target.value)}
//           />
//           <button type="submit" className="add-btn">
//             ➕ Add Worker
//           </button>
//         </form>

//         <div className="worker-list">
//           {workers.length > 0 ? (
//             workers.map((w) => (
//               <div key={w.id} className="worker-card">
//                 👷 {w.name} — {w.contact}
//               </div>
//             ))
//           ) : (
//             <p>No workers added yet</p>
//           )}
//         </div>
//       </div>

//       <div className="dept-section">
//         <h2>📋 Complaints Assigned to {departmentName}</h2>

//         <table className="dept-complaints-table">
//           <thead>
//             <tr>
//               <th>Grievance ID</th>
//               <th>Title</th>
//               <th>Location</th>
//               <th>Status</th>
//               <th>View / Update</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.length > 0 ? (
//               complaints.map((c) => (
//                 <tr key={c.id}>
//                   <td>{c.grievanceId}</td>
//                   <td>{c.title}</td>
//                   <td>{c.location}</td>
//                   <td>{c.status}</td>
//                   <td>
//                     <button className="update-btn" onClick={() => setSelectedComplaint(c)}>
//                       Update
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">No complaints assigned yet</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {selectedComplaint && (
//         <div className="dept-modal-overlay" onClick={() => setSelectedComplaint(null)}>
//           <div className="dept-modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>{selectedComplaint.title}</h2>
//             <p>
//               <b>Grievance ID:</b> {selectedComplaint.grievanceId}
//             </p>
//             <p>
//               <b>Description:</b> {selectedComplaint.description}
//             </p>
//             <p>
//               <b>Location:</b> {selectedComplaint.location}
//             </p>

//             <label>Choose up to 4 workers to assign:</label>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
//               {workers.length === 0 && <div>No workers available. Add workers above.</div>}
//               {workers.map((w) => (
//                 <label key={w.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                   <input
//                     type="checkbox"
//                     checked={selectedWorkers.includes(w.name)}
//                     onChange={() => toggleWorkerSelection(w.name)}
//                   />
//                   <span>{w.name}</span>
//                 </label>
//               ))}
//             </div>

//             <label style={{ marginTop: "12px" }}>Upload Photo / Proof (preview):</label>
//             <input type="file" onChange={handlePhotoChange} />

//             {/* show preview of new upload */}
//             {photoPreview && (
//               <div style={{ marginTop: 10 }}>
//                 <b>Preview:</b>
//                 <div>
//                   <img src={photoPreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8 }} />
//                 </div>
//               </div>
//             )}

//             {/* show existing uploaded media (if present in DB) */}
//             {/* {!photoPreview && selectedComplaint.mediaPath && (
//               <div style={{ marginTop: 10 }}>
//                 <b>Existing Proof:</b>
//                 <div>
//                   <img
//                     src={getMediaUrl(selectedComplaint.mediaPath)}
//                     alt="existing proof"
//                     style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
//                     onClick={() => window.open(getMediaUrl(selectedComplaint.mediaPath), "_blank")}
//                   />
//                 </div>
//               </div>
//             )} */}
//             {/* ✅ Show original user grievance image */}
// {selectedComplaint.grievanceMediaPath && (
//   <div style={{ marginTop: 10 }}>
//     <b>User Uploaded Grievance Photo:</b>
//     <div>
//       <img
//         src={getMediaUrl(selectedComplaint.grievanceMediaPath)}
//         alt="user grievance"
//         style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
//         onClick={() => window.open(getMediaUrl(selectedComplaint.grievanceMediaPath), "_blank")}
//       />
//     </div>
//   </div>
// )}

// {/* ✅ Show department proof image (if exists) */}
// {selectedComplaint.proofMediaPath && (
//   <div style={{ marginTop: 10 }}>
//     <b>Department Proof Uploaded:</b>
//     <div>
//       <img
//         src={getMediaUrl(selectedComplaint.proofMediaPath)}
//         alt="department proof"
//         style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
//         onClick={() => window.open(getMediaUrl(selectedComplaint.proofMediaPath), "_blank")}
//       />
//     </div>
//   </div>
// )}


//             <label style={{ marginTop: 12 }}>Status:</label>
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="In Progress">In Progress</option>
//               <option value="Resolved">Resolved</option>
//             </select>

//             <label style={{ marginTop: 12 }}>Comment:</label>
//             <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />

//             <div className="dept-modal-buttons" style={{ marginTop: 16 }}>
//               <button
//                 className="save-btn"
//                 onClick={() => handleUpdateComplaint(selectedComplaint.id)}
//               >
//                 Save Changes
//               </button>
//               <button className="close-btn" onClick={() => setSelectedComplaint(null)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DepartmentDashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./DepartmentDashboard.css";

function DepartmentDashboard() {
  const location = useLocation();
  const departmentName =
    location.state?.departmentName || localStorage.getItem("departmentName") || "Department";

  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [workerNameInput, setWorkerNameInput] = useState("");
  const [workerContactInput, setWorkerContactInput] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState([]); // multiple
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("In Progress");

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/workers/${departmentName}`)
      .then((res) => setWorkers(res.data))
      .catch((err) => console.error("Error fetching workers:", err));
  }, [departmentName]);

  useEffect(() => {
    if (!departmentName) return;
    axios
      .get(`http://localhost:8082/api/complaints/department/${departmentName}`)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, [departmentName]);

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!workerNameInput || !workerContactInput) {
      alert("Please fill all fields");
      return;
    }
    axios
      .post("http://localhost:8082/api/workers/add", {
        department: departmentName,
        name: workerNameInput,
        contact: workerContactInput,
      })
      .then((res) => {
        setWorkers([...workers, res.data]);
        setWorkerNameInput("");
        setWorkerContactInput("");
      })
      .catch((err) => console.error("Error adding worker:", err));
  };

  const toggleWorkerSelection = (name) => {
    const exists = selectedWorkers.includes(name);
    if (exists) {
      setSelectedWorkers(selectedWorkers.filter((w) => w !== name));
      return;
    }
    if (selectedWorkers.length >= 4) {
      alert("You can select up to 4 workers only.");
      return;
    }
    setSelectedWorkers([...selectedWorkers, name]);
  };

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhoto(f);
    const url = URL.createObjectURL(f);
    setPhotoPreview(url);
  };

  // construct URL for images saved as /uploads/<filename>
  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return null;
    const parts = mediaPath.split("/");
    const filename = parts[parts.length - 1];
    return `http://localhost:8082/uploads/${encodeURIComponent(filename)}`;
  };

  const handleUpdateComplaint = (id) => {
    const formData = new FormData();
    const workersString = selectedWorkers.join(", ");
    formData.append("workerName", workersString);
    formData.append("status", status);
    formData.append("comment", comment);
    if (photo) formData.append("photo", photo);

    axios
      .put(`http://localhost:8082/api/complaints/${id}/update-by-department`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert("Complaint updated successfully!");
        setComplaints((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        setSelectedComplaint(null);
        setPhoto(null);
        setPhotoPreview(null);
        setSelectedWorkers([]);
        setComment("");
        setStatus("In Progress");
      })
      .catch((err) => {
        console.error("Error updating complaint:", err);
        alert("Update failed. Try again.");
      });
  };
  const handleDeleteWorker = (id) => {
  if (!window.confirm("Are you sure you want to delete this worker?")) return;

  axios
    .delete(`http://localhost:8082/api/workers/${id}`)
    .then(() => {
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      alert("Worker deleted successfully!");
    })
    .catch((err) => {
      console.error("Error deleting worker:", err);
      alert("Failed to delete worker.");
    });
};


  return (
    <div className="dept-dashboard-container">
      <h1 className="dept-dashboard-title">{departmentName} Dashboard</h1>

      <div className="dept-section">
        <h2>👷 Add Workers</h2>
        <form className="worker-form" onSubmit={handleAddWorker}>
          <input
            type="text"
            placeholder="Worker Name"
            value={workerNameInput}
            onChange={(e) => setWorkerNameInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={workerContactInput}
            onChange={(e) => setWorkerContactInput(e.target.value)}
          />
          <button type="submit" className="add-btn">
            ➕ Add Worker
          </button>
        </form>

        <div className="worker-list">
          {workers.length > 0 ? (
            workers.map((w) => (
              <div key={w.id} className="worker-card">
                {/* 👷 {w.name} — {w.contact} */}
                <span>👷 {w.name} — {w.contact}</span>
        <span
          className="delete-worker"
          title="Delete Worker"
          onClick={() => handleDeleteWorker(w.id)}
        >
          🗑️
        </span>
              </div>
            ))
          ) : (
            <p>No workers added yet</p>
          )}
        </div>
      </div>

      <div className="dept-section">
        <h2>📋 Complaints Assigned to {departmentName}</h2>

        <table className="dept-complaints-table">
          <thead>
            <tr>
              <th>Grievance ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Completion Date</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>View / Update</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.grievanceId}</td>
                  <td>{c.title}</td>
                  <td>{c.location}</td>
                  <td>{c.status}</td>
                  <td>{c.dueDate ? c.dueDate : "—"}</td>
                  <td>{c.completionDate ? c.completionDate : "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    {c.starRating ? (
                      <span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < c.starRating ? "★" : "☆"}</span>
                        ))}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.userFeedback ? c.userFeedback : "-"}
                  </td>
                  <td>
                    {/* <button className="update-btn" onClick={() => setSelectedComplaint(c)}>
                      Update
                    </button> */}
                    {c.status?.toLowerCase() === "resolved" ? (
  <span style={{ color: "green", fontWeight: "bold" }}>Resolved ✅</span>
) : (
  <button className="update-btn" onClick={() => setSelectedComplaint(c)}>
    Update
  </button>
)}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No complaints assigned yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <div className="dept-modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="dept-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedComplaint.title}</h2>
            <p>
              <b>Grievance ID:</b> {selectedComplaint.grievanceId}
            </p>
            <p>
              <b>Description:</b> {selectedComplaint.description}
            </p>
            <p>
              <b>Location:</b> {selectedComplaint.location}
            </p>

            <label>Choose up to 4 workers to assign:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {workers.length === 0 && <div>No workers available. Add workers above.</div>}
              {workers.map((w) => (
                <label key={w.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="checkbox"
                    checked={selectedWorkers.includes(w.name)}
                    onChange={() => toggleWorkerSelection(w.name)}
                  />
                  <span>{w.name}</span>
                </label>
              ))}
            </div>

            <label style={{ marginTop: "12px" }}>Upload Photo / Proof (preview):</label>
            <input type="file" onChange={handlePhotoChange} />

            {/* show preview of new upload */}
            {photoPreview && (
              <div style={{ marginTop: 10 }}>
                <b>Preview:</b>
                <div>
                  <img src={photoPreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8 }} />
                </div>
              </div>
            )}

            {/* show existing uploaded media (if present in DB) */}
            {selectedComplaint.mediaPath && !photoPreview && (
              <div style={{ marginTop: 10 }}>
                <b>Existing Proof:</b>
                <div>
                  <img
                    src={getMediaUrl(selectedComplaint.mediaPath)}
                    alt="existing proof"
                    style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
                    onClick={() => window.open(getMediaUrl(selectedComplaint.mediaPath), "_blank")}
                  />
                </div>
              </div>
            )}

            {/* Show user grievance photo if exists */}
            {selectedComplaint.grievanceMediaPath && (
              <div style={{ marginTop: 10 }}>
                <b>User Uploaded Grievance Photo:</b>
                <div>
                  <img
                    src={getMediaUrl(selectedComplaint.grievanceMediaPath)}
                    alt="user grievance"
                    style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
                    onClick={() => window.open(getMediaUrl(selectedComplaint.grievanceMediaPath), "_blank")}
                  />
                </div>
              </div>
            )}

            {/* Show department proof image (if exists) */}
            {selectedComplaint.proofMediaPath && (
              <div style={{ marginTop: 10 }}>
                <b>Department Proof Uploaded:</b>
                <div>
                  <img
                    src={getMediaUrl(selectedComplaint.proofMediaPath)}
                    alt="department proof"
                    style={{ maxWidth: "100%", maxHeight: 260, marginTop: 8, cursor: "pointer" }}
                    onClick={() => window.open(getMediaUrl(selectedComplaint.proofMediaPath), "_blank")}
                  />
                </div>
              </div>
            )}

            <label style={{ marginTop: 12 }}>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <label style={{ marginTop: 12 }}>Comment:</label>
            <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />

            <div className="dept-modal-buttons" style={{ marginTop: 16 }}>
              <button
                className="save-btn"
                onClick={() => handleUpdateComplaint(selectedComplaint.id)}
              >
                Save Changes
              </button>
              <button className="close-btn" onClick={() => setSelectedComplaint(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentDashboard;
