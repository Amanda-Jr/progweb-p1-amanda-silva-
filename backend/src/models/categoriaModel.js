import { db } from '../db.js';

// Mesmo contrato da S3 (listar, buscarPorId, existeNome, inserir,
// atualizar, remover). Só o "como" mudou: o array virou tabela.
export const categoriaModel = {
  listar() {
    return db.prepare('SELECT * FROM categorias ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM categorias WHERE id = ?').get(id) ?? null;
  },

  // ignorarId permite atualizar uma categoria sem conflitar com ela mesma.
  // COLLATE NOCASE ignora maiúsculas; o trim() fica por conta do JS.
  existeNome(nome, ignorarId = null) {
    const linha = db
      .prepare(
        'SELECT 1 FROM categorias WHERE nome = ? COLLATE NOCASE AND id IS NOT ?',
      )
      .get(nome.trim(), ignorarId);
    return linha !== undefined;
  },

  inserir({ nome, descricao }) {
    const r = db
      .prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)')
      .run(nome.trim(), descricao ?? null);
    return this.buscarPorId(Number(r.lastInsertRowid));
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?')
      .run(novo.nome, novo.descricao ?? null, id); // o id nunca muda
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};