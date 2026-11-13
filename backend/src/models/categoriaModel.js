// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let categorias = [];
let proximoId = 1;

// Compara nomes sem diferenciar maiúsculas de minúsculas nem espaços nas pontas
const normalizar = (texto) => texto.trim().toLowerCase();

export const categoriaModel = {
  listar() {
    return categorias;
  },

  buscarPorId(id) {
    return categorias.find((c) => c.id === id) ?? null;
  },

  // ignorarId permite atualizar uma categoria sem conflitar com ela mesma
  existeNome(nome, ignorarId = null) {
    return categorias.some(
      (c) => normalizar(c.nome) === normalizar(nome) && c.id !== ignorarId
    );
  },

  inserir({ nome, descricao }) {
    const nova = {
      id: proximoId++,
      nome: nome.trim(),
      descricao: descricao ?? null,
    };
    categorias.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = categorias.findIndex((c) => c.id === id);
    if (i === -1) return null;
    categorias[i] = { ...categorias[i], ...dados, id }; // o id nunca muda
    return categorias[i];
  },

  remover(id) {
    const antes = categorias.length;
    categorias = categorias.filter((c) => c.id !== id);
    return categorias.length < antes; // true = removeu
  },
};