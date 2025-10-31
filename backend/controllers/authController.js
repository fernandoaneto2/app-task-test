import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    console.log("🔐 Login frontend - email:", email);

    // Aguardar 10 segundos
    console.log("⏰ Aguardando 10 segundos...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // ✅ VERIFICAÇÃO 100% FRONTEND - SEM BACKEND
    if (email === "admin@empresa.com" && password === "admin123") {
      const userData = {
        id: 1,
        email: "admin@empresa.com",
        name: "Administrador",
        role: "admin",
      };

      console.log("✅ Login frontend bem-sucedido!");
      setUser(userData);
      return { success: true, user: userData };
    }

    console.log("❌ Credenciais inválidas no frontend");
    return {
      success: false,
      error: "Credenciais inválidas. Use: admin@empresa.com / admin123",
    };
  };

  const logout = () => {
    console.log("🚪 Logout frontend");
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading: false,
    authChecked: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
