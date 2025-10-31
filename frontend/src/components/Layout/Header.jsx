import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/projects", label: "Projetos" },
    { path: "/tasks", label: "Tarefas" },
    { path: "/users", label: "Usuários", adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">EJ UNICAP</span>
          </div>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin()) return null;

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default Header;
