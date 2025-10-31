import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/projects", icon: "📁", label: "Projetos" },
    { path: "/tasks", icon: "✅", label: "Tarefas" },
    { path: "/users", icon: "👥", label: "Usuários", adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const currentPage =
    menuItems.find((item) => item.path === location.pathname)?.label ||
    "Dashboard";

  return (
    <div className="layout">
      {/* Sidebar Fixo com ícones quando fechado */}
      <div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            {sidebarOpen && <span className="logo-text">EJ UNICAP</span>}
          </div>
          {sidebarOpen && (
            <button
              className="toggle-btn"
              onClick={() => setSidebarOpen(false)}
              title="Recolher menu"
            >
              ◀
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin()) return null;

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                data-tooltip={item.label}
                title={sidebarOpen ? "" : item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-name">{user?.name || "Usuário"}</div>
                <div className="user-email">{user?.email || ""}</div>
                <div className="user-role">
                  {isAdmin() ? "Gerente" : "Consultor"}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title={sidebarOpen ? "" : "Sair"}
          >
            {sidebarOpen ? "Sair" : "🚪"}
          </button>
        </div>
      </div>

      {/* Main Content com largura ajustável */}
      <div className={`main-content ${sidebarOpen ? "" : "full-width"}`}>
        <header className="content-header">
          <h1>
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Recolher menu" : "Expandir menu"}
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
            {currentPage}
          </h1>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
