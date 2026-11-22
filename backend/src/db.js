import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// A tabela "pai" (categorias) vem primeiro: receitas referencia categorias(id).
db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    descricao TEXT
  );

  CREATE TABLE IF NOT EXISTS receitas (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo            TEXT NOT NULL,
    modo_preparo      TEXT NOT NULL,
    tempo_preparo_min INTEGER NOT NULL CHECK (tempo_preparo_min > 0),
    porcoes           INTEGER NOT NULL CHECK (porcoes > 0),
    categoria_id      INTEGER NOT NULL REFERENCES categorias(id)
  );
`);

const { total } = db.prepare('SELECT COUNT(*) AS total FROM categorias').get();
if (total === 0) {
  const inserirCategoria = db.prepare(
    'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
  );
  const sobremesa = inserirCategoria.run('Sobremesa', 'Doces e sobremesas em geral');
  const massa = inserirCategoria.run('Massa', 'Macarrão, lasanha e afins');
  const salada = inserirCategoria.run('Salada', 'Pratos leves e frescos');

  const inserirReceita = db.prepare(
    `INSERT INTO receitas
       (titulo, modo_preparo, tempo_preparo_min, porcoes, categoria_id)
     VALUES (?, ?, ?, ?, ?)`,
  );
  inserirReceita.run(
    'Pudim de leite',
    'Bata os ingredientes no liquidificador, coloque na forma caramelizada e asse em banho-maria.',
    90, 8, sobremesa.lastInsertRowid,
  );
  inserirReceita.run(
    'Mousse de maracujá',
    'Bata o creme de leite com o leite condensado e o suco, e leve à geladeira por 4 horas.',
    15, 6, sobremesa.lastInsertRowid,
  );
  inserirReceita.run(
    'Macarrão alho e óleo',
    'Cozinhe a massa e refogue o alho no azeite. Misture e finalize com salsinha.',
    20, 2, massa.lastInsertRowid,
  );
  inserirReceita.run(
    'Salada de tomate e manjericão',
    'Corte os tomates, tempere com azeite, sal e folhas de manjericão.',
    10, 2, salada.lastInsertRowid,
  );
}