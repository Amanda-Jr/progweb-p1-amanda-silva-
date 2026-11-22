import { db } from '../db.js';

// No banco: snake_case (modo_preparo, categoria_id). No JSON da API: camelCase.
// O AS traduz aqui, na única camada que conhece o banco.
const COLUNAS = `id, titulo, modo_preparo AS modoPreparo,
  tempo_preparo_min AS tempoPreparoMin, porcoes,
  categoria_id AS categoriaId`;

export const receitaModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM receitas ORDER BY id`).all();
  },

  listarPorCategoria(categoriaId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM receitas WHERE categoria_id = ? ORDER BY id`)
      .all(categoriaId);
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM receitas WHERE id = ?`)
      .get(id) ?? null;
  },

  inserir({ titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId }) {
    const r = db
      .prepare(`INSERT INTO receitas
                  (titulo, modo_preparo, tempo_preparo_min, porcoes, categoria_id)
                VALUES (?, ?, ?, ?, ?)`)
      .run(
        titulo.trim(),
        modoPreparo.trim(),
        Number(tempoPreparoMin),
        Number(porcoes),
        Number(categoriaId),
      );
    return this.buscarPorId(Number(r.lastInsertRowid));
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE receitas
                SET titulo = ?, modo_preparo = ?, tempo_preparo_min = ?,
                    porcoes = ?, categoria_id = ?
                WHERE id = ?`)
      .run(
        novo.titulo,
        novo.modoPreparo,
        Number(novo.tempoPreparoMin),
        Number(novo.porcoes),
        Number(novo.categoriaId),
        id, // o id nunca muda
      );
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM receitas WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};