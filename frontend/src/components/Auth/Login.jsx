import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("admin@empresa.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth(); // ✅ Adicionei user aqui para debug
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Iniciando processo de login...");
    setLoading(true);
    setError("");

    try {
      // ✅ DELAY DE 10 SEGUNDOS
      console.log("⏰ Aguardando 10 segundos...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await login(email, password);
      console.log("📨 Resultado do login:", result);

      // ✅ DEBUG: Verificar estado do user após login
      console.log("🔍 Estado do user após login:", user);

      if (result && result.success) {
        console.log("🎉 Login bem-sucedido! Redirecionando...");

        // ✅ PEQUENO DELAY para garantir que o estado foi atualizado
        await new Promise((resolve) => setTimeout(resolve, 100));

        // ✅ REDIRECIONAMENTO IMEDIATO
        navigate("/dashboard", { replace: true });
      } else {
        console.log("❌ Erro no login:", result?.error);
        setError(result?.error || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("💥 Erro inesperado:", err);
      setError("Erro inesperado no sistema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="tech-logo">⚡</div>
          <h1>TASK MANAGEMENT</h1>
          <div className="glow-line"></div>
        </div>

        <p className="login-subtitle">Faça login para acessar o sistema</p>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EMAIL:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@empresa.com"
              className="tech-input"
            />
          </div>

          <div className="form-group">
            <label>SENHA:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="tech-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "PROCESSANDO... (10s)" : "ACESSAR SISTEMA"}
          </button>
        </form>

        <div className="login-info">
          <div className="info-header">
            <span className="info-icon">🔐</span>
            <strong>Credenciais de Teste</strong>
          </div>
          <div className="info-content">
            <p>Email: admin@empresa.com</p>
            <p>Senha: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
