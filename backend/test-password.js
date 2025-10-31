import bcrypt from "bcryptjs";

async function testPassword() {
  const password = "admin123";

  // Hash que está no banco - COLE AQUI O HASH DO BANCO
  const hashFromDB =
    "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

  console.log("🔐 Testando senha...");
  console.log("Senha digitada:", password);
  console.log("Hash no banco:", hashFromDB);

  // Testar comparação
  const isMatch = await bcrypt.compare(password, hashFromDB);
  console.log("✅ Senha correta?", isMatch);

  // Gerar novo hash
  const newHash = await bcrypt.hash(password, 10);
  console.log("🆕 Novo hash:", newHash);
}

testPassword();
