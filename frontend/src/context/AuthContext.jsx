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
    console.log("🔐 Tentando login:", email);

    // Aguardar 10 segundos
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Verificação SIMPLES
    if (email === "admin@empresa.com" && password === "admin123") {
      const userData = {
        id: 1,
        email: "admin@empresa.com",
        name: "Administrador",
        role: "admin",
      };

      console.log("✅ Login bem-sucedido - definindo user:", userData.email);
      setUser(userData);
      return { success: true, user: userData };
    }

    return {
      success: false,
      error: "Credenciais inválidas. Use: admin@empresa.com / admin123",
    };
  };

  const logout = () => {
    console.log("🚪 Fazendo logout");
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

  console.log("🔄 AuthContext render - user:", user ? user.email : "null");

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
