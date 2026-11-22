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