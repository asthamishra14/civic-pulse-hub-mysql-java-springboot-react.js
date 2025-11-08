// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function Layout() {
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);
//   const [user, setUser] = useState({
//     name: "Guest User",
//     email: "guest@example.com",
//   });
//   const profileRef = useRef(null);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const toggleProfilePopup = () => setShowProfile(!showProfile);

//   useEffect(() => {
//     const loggedUser = JSON.parse(localStorage.getItem("user"));
//     if (loggedUser) setUser(loggedUser);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfile(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [profileRef]);

//   return (
//     <div className="container">
//       <header>
//         <div className="header-left">
//         CivicPulse Hub Unified Smart City Feedback and Redressal System
//         </div>
//         <div className="header-right" ref={profileRef}>
//           <div className="profile-icon" onClick={toggleProfilePopup}>👤</div>
//           {showProfile && (
//             <div className="profile-popup">
//               <p><strong>Name:</strong> {user.name}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//             </div>
//           )}
//         </div>
//       </header>

//       <nav>
//         <div className="nav-logo"><h3>CivicPulse</h3></div>
//         <ul>
//           <li><a href="/home">Home</a></li>
//           <li><a href="/dashboard">Dashboard</a></li>
//           <li><a href="/services">Services</a></li>
//           <li><a href="/contact">Contact</a></li>
//           <li><a href="/about">About</a></li>
//           <li>
//             <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
//           </li>
//         </ul>
//       </nav>

//       <article>
//         <h2>Welcome to CivicPulse Hub</h2>
//         <p>This is the article/content area.</p>
//       </article>

//       <aside>
//         <div className="ad"><h2>Aside</h2></div>
//       </aside>

//       <footer>
//         © 2025 My Website. All rights reserved. | Privacy Policy | Terms of Service
//       </footer>
//     </div>
//   );
// }

// export default Layout;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import "./App.css";

function Layout() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
  });
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleProfilePopup = () => setShowProfile(!showProfile);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) setUser(loggedUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  return (
    <div className="container">
      <header>
        <div className="header-left">
          CivicPulse Hub Unified Smart City Feedback and Redressal System
        </div>
        <div className="header-right" ref={profileRef}>
          <FaUserCircle
            className="profile-icon"
            onClick={toggleProfilePopup}
            style={{ fontSize: "32px", cursor: "pointer", color: "#87e5efff" }}
          />
          {showProfile && (
            <div className="profile-popup">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}
        </div>
      </header>

      <nav>
        <div className="nav-logo"><h3>CivicPulse</h3></div>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <article>
        <h2>Welcome to CivicPulse Hub</h2>
        <p>This is the article/content area.</p>
      </article>

      <aside>
        <div className="ad"><h2>Aside</h2></div>
      </aside>

      <footer>
        © 2025 My Website. All rights reserved. | Privacy Policy | Terms of Service
      </footer>
    </div>
  );
}

export default Layout;
