import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import pool from "./config/database.js";

async function createAdminUser() {
  try {
    // Verificar se o pool de conexões está ativo
    await pool.getConnection().then((conn) => conn.release());
    console.log("✅ Conexão com o banco de dados estabelecida.");

    const email = "admin@empresa.com";
    const password = "admin123";
    const name = "Admin Principal";
    const role = "admin";

    // 1. Verificar se o usuário já existe
    let adminUser = await User.findByEmail(email);

    if (adminUser) {
      console.log(
        `⚠️ Usuário admin (${email}) já existe. Atualizando senha...`
      );
    }

    // 2. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (adminUser) {
      // 3. Atualizar o usuário existente
      await User.update(adminUser.id, {
        password: hashedPassword,
        is_active: true,
      });
      console.log(`✅ Senha do admin atualizada com sucesso!`);
    } else {
      // 3. Criar o novo usuário
      adminUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      console.log(`✅ Usuário admin (${email}) criado com sucesso!`);
    }

    console.log("🔑 Credenciais de login (se não alteradas):");
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
  } catch (error) {
    console.error("❌ Erro ao criar ou atualizar o usuário admin:", error);
  } finally {
    // Não encerrar aqui, pois o script pode ser executado como um comando npm
  }
}

createAdminUser();
