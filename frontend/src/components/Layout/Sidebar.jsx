import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/projects", icon: "📁", label: "Projetos" },
    { path: "/tasks", icon: "✅", label: "Tarefas" },
  ];

  if (isAdmin()) {
    menuItems.push({ path: "/users", icon: "👥", label: "Usuários" });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="system-info">
          <small>LV OFFICE v1.0</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
