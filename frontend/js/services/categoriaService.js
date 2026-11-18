import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ nome, descricao }) {
  const dados = {
    nome: (nome ?? '').trim(),
    descricao: (descricao ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome da categoria.');
  return dados;
}

export const categoriaService = {
  listar() {
    return api.get('/categorias');
  },

  async criar(dados) {
    return api.post('/categorias', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/categorias/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/categorias/${id}`);
  },
};