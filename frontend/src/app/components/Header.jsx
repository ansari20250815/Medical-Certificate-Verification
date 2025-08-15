import React from "react";
import '../Dashboard.css';


const Header = () => (
  <header className="header">
  <div className="language">Language : <span>English</span></div>

  <div className="user-profile">
    <img src="/Avatar.png" alt="Profile" className="avatar" />
    <div className="user-info">
      <h3>Ansari</h3>
      <span className="status">Software Engineer</span>
    </div>
  </div>
</header>

);

export default Header;
