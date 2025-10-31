const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando Task Management System...\n");

// Verificar se os diretórios existem
if (!fs.existsSync("backend")) {
  console.error("❌ Diretório backend não encontrado!");
  process.exit(1);
}

if (!fs.existsSync("frontend")) {
  console.error("❌ Diretório frontend não encontrado!");
  process.exit(1);
}

console.log("📁 Estrutura verificada com sucesso!");

// Instalar dependências do backend
console.log("\n📦 Instalando dependências do backend...");
exec("cd backend && npm install", (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Erro ao instalar backend:", error);
    return;
  }
  console.log("✅ Backend dependencies instaladas!");

  // Instalar dependências do frontend
  console.log("\n📦 Instalando dependências do frontend...");
  exec("cd frontend && npm install", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao instalar frontend:", error);
      return;
    }
    console.log("✅ Frontend dependencies instaladas!");

    console.log("\n🎉 Todas as dependências instaladas com sucesso!");
    console.log("\n📋 PRÓXIMOS PASSOS:");
    console.log("1. Configure o MySQL com o arquivo database/schema.sql");
    console.log("2. Ajuste as credenciais no arquivo backend/.env");
    console.log("3. Execute o backend: cd backend && npm run dev");
    console.log("4. Execute o frontend: cd frontend && npm run dev");
    console.log("\n🌐 URLs:");
    console.log("   Backend: http://localhost:5001");
    console.log("   Frontend: http://localhost:3000");
    console.log("   Login: admin@empresa.com / admin123");
  });
});
