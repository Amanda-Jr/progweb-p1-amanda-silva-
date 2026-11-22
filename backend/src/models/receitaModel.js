// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let receitas = [];
let proximoId = 1;

export const receitaModel = {
  listar() {
    return receitas;
  },

  listarPorCategoria(categoriaId) {
    return receitas.filter((r) => r.categoriaId === categoriaId);
  },

  buscarPorId(id) {
    return receitas.find((r) => r.id === id) ?? null;
  },

  inserir({ titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId }) {
    const nova = {
      id: proximoId++,
      titulo: titulo.trim(),
      modoPreparo: modoPreparo.trim(),
      tempoPreparoMin,
      porcoes,
      categoriaId,
    };
    receitas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = receitas.findIndex((r) => r.id === id);
    if (i === -1) return null;
    receitas[i] = { ...receitas[i], ...dados, id }; // o id nunca muda
    return receitas[i];
  },

  remover(id) {
    const antes = receitas.length;
    receitas = receitas.filter((r) => r.id !== id);
    return receitas.length < antes; // true = removeu
  },
};