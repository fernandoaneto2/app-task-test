import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./components/Auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Users from "./pages/Users.jsx";
import Layout from "./components/Layout/Layout.jsx";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log(
    "🛡️ ProtectedRoute - user:",
    user ? `✅ ${user.email}` : "❌ null"
  );

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
