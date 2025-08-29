import React, { useState } from "react";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaCog,
  FaHeadset,
} from "react-icons/fa";
import "./Sidebar.css";

const topMenuItems = [
  {
    id: 1,
    icon: <FaTachometerAlt />,
    label: "Manage Leaves",
    subMenu: [
      { id: "1-1", label: "Apply Leave" },
      { id: "1-2", label: "View Leave Status" },
    ],
  },
  {
    id: 2,
    icon: <FaCalendarAlt />,
    label: "Leave Calendar",
  },
];

const bottomMenuItems = [
  {
    id: 6,
    icon: <FaCog />,
    label: "Settings",
    isDisabled: true,
  },
  {
    id: 7,
    icon: <FaHeadset />,
    label: "Help & Support",
    isDisabled: true,
  },
];

const Sidebar = () => {
  const [openSubMenuId, setOpenSubMenuId] = useState(null);

  const handleMenuClick = (id, hasSubMenu) => {
    if (hasSubMenu) {
      setOpenSubMenuId(openSubMenuId === id ? null : id);
    } else {
      setOpenSubMenuId(null);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/CLlogo.png" alt="CL Logo" className="cl-logo" />
      </div>

      <ul className="sidebar-menu top-menu">
        {topMenuItems.map(({ id, icon, label, subMenu }) => (
          <li key={id}>
            <div
              className={`menu-item ${
                openSubMenuId === id ? "active" : ""
              }`}
              onClick={() => handleMenuClick(id, !!subMenu)}
            >
              <span className="icon">{icon}</span>
              <span className="label">
                {label}
                {subMenu && (
                  <span className="arrow">
                    {openSubMenuId === id ? "▲" : "▼"}
                  </span>
                )}
              </span>
            </div>
            
            {openSubMenuId === id && subMenu && (
              <ul className="submenu">
                {subMenu.map(({ id: subId, label: subLabel }) => (
                  <li key={subId} className="submenu-item">
                    {subLabel === "Apply Leave" ? (
                      <Link href="/documents/form" className="submenu-link">
                        {subLabel}
                      </Link>
                    ) : (
                      subLabel
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <ul className="sidebar-menu bottom-menu">
        {bottomMenuItems.map(({ id, icon, label, isDisabled }) => (
          <li
            key={id}
            className={`menu-item ${isDisabled ? "disabled" : ""}`}
            onClick={() => !isDisabled && setOpenSubMenuId(null)}
          >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
