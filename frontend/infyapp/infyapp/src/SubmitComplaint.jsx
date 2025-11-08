import React, { useState } from "react";
import ComplaintSuccess from "./ComplaintSuccess";
import "./SubmitComplaint.css";
import axios from "axios";

export default function SubmitComplaint() {
  const [submitted, setSubmitted] = useState(false);
  const [grievanceId, setGrievanceId] = useState(""); 
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    category: "",
    location: "",
    description: "",
  });

  const [files, setFiles] = useState([]);

  //  handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  handle file upload
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles); 
  };

  //  handle submit send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("description", formData.description);

      if (files.length > 0) {
        data.append("media", files[0]); 
      }

      // Send to backend
      const res = await axios.post(
        "http://localhost:8082/api/complaints/submit",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", res.data);
      setGrievanceId(res.data.grievanceId); 
      setSubmitted(true);

    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  // Show success screen after submit
  if (submitted) {
    return <ComplaintSuccess grievanceId={grievanceId} />;
  }

  return (
    <div className="submit-wrapper">
      <form className="submit-form" onSubmit={handleSubmit}>
        <h2>Submit a Complaint</h2>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Complaint title"
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Public Infrastructure">Public Infrastructure</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Traffic">Traffic</option>
          <option value="Transport">Transport</option>
          <option value="Water">Water</option>
          <option value="Other">Other</option>
        </select>

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          rows="4"
        ></textarea>

        <label>Upload Media (optional)</label>
        <input type="file" onChange={handleFileChange} />

        {/* File Preview */}
        <div className="file-preview">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt="preview" />
              ) : (
                <p>{file.name}</p>
              )}
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
