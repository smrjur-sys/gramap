const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './db/gramap.db';
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('\n🗄️  Inicializando banco de dados GRAMAP...');
console.log(`📍 Caminho do banco: ${dbPath}\n`);

// Criar diretório db se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`✅ Diretório criado: ${dbDir}`);
}

// Criar/abrir banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('\n❌ Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao SQLite');
});

// Ler e executar schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('\n❌ Erro ao executar schema:', err.message);
    process.exit(1);
  }
  console.log('✅ Banco de dados inicializado com sucesso!');
  console.log('\n📋 Tabelas criadas:');
  console.log('   • users (usuários)');
  console.log('   • points (pontos comerciais)');
  console.log('   • images (imagens)');
  console.log('\n🎉 Banco de dados pronto para uso!\n');
  
  db.close((err) => {
    if (err) {
      console.error('❌ Erro ao fechar banco:', err.message);
      process.exit(1);
    }
    console.log('✅ Conexão fechada.\n');
  });
});
