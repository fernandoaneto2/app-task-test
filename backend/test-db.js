import pool from "./config/database.js";

async function testDatabase() {
  try {
    console.log("🧪 Testando conexão com o banco...");

    // Testar conexão
    const connection = await pool.getConnection();
    console.log("✅ Conexão OK");
    connection.release();

    // Testar leitura
    const [users] = await pool.execute("SELECT * FROM users");
    console.log("👥 Usuários no banco:", users);

    // Testar inserção
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Teste", "teste@teste.com", "hash123", "user"]
    );
    console.log("✅ Inserção teste OK, ID:", result.insertId);

    // Limpar teste
    await pool.execute("DELETE FROM users WHERE email = ?", [
      "teste@teste.com",
    ]);
    console.log("🧹 Teste limpo");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

testDatabase();
