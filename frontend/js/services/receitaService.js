import { api } from '../api.js';

const inteiroPositivo = (n) => Number.isInteger(n) && n > 0;

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId }) {
  const dados = {
    titulo: (titulo ?? '').trim(),
    modoPreparo: (modoPreparo ?? '').trim(),
    // campo numérico chega como string: converte aqui
    tempoPreparoMin: Number(tempoPreparoMin),
    porcoes: Number(porcoes),
    categoriaId: Number(categoriaId), // "" vira 0 e cai na validação abaixo
  };
  if (!dados.titulo) throw new Error('Informe o título da receita.');
  if (!dados.modoPreparo) throw new Error('Informe o modo de preparo.');
  if (!inteiroPositivo(dados.tempoPreparoMin)) {
    throw new Error('O tempo de preparo deve ser um número inteiro maior que 0.');
  }
  if (!inteiroPositivo(dados.porcoes)) {
    throw new Error('As porções devem ser um número inteiro maior que 0.');
  }
  if (!inteiroPositivo(dados.categoriaId)) throw new Error('Escolha uma categoria.');
  return dados;
}

export const receitaService = {
  listar() {
    return api.get('/receitas');
  },

  async criar(dados) {
    return api.post('/receitas', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/receitas/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/receitas/${id}`);
  },
};