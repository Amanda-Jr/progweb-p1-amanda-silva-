import { receitaModel } from '../models/receitaModel.js';
import { categoriaModel } from '../models/categoriaModel.js';
import { erro } from '../utils/erro.js';

const textoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';
const inteiroPositivo = (valor) => Number.isInteger(valor) && valor > 0;

export const receitaService = {
  // Se vier categoriaId, filtra (GET /receitas?categoriaId=1)
  listar(categoriaId) {
    if (categoriaId === undefined) return receitaModel.listar();
    return receitaModel.listarPorCategoria(categoriaId);
  },

  buscarPorId(id) {
    const receita = receitaModel.buscarPorId(id);
    if (!receita) throw erro(404, 'Receita não encontrada');
    return receita;
  },

  criar({ titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId } = {}) {
    // Regra 1: campos obrigatórios
    if (!textoValido(titulo)) throw erro(400, 'Campo "titulo" é obrigatório');
    if (!textoValido(modoPreparo)) throw erro(400, 'Campo "modoPreparo" é obrigatório');
    if (categoriaId === undefined) throw erro(400, 'Campo "categoriaId" é obrigatório');

    // Regra 2: números inteiros maiores que 0
    if (!inteiroPositivo(tempoPreparoMin)) {
      throw erro(400, 'Campo "tempoPreparoMin" deve ser um inteiro maior que 0');
    }
    if (!inteiroPositivo(porcoes)) {
      throw erro(400, 'Campo "porcoes" deve ser um inteiro maior que 0');
    }

    // Regra 3: a categoria (o pai) precisa existir
    if (!categoriaModel.buscarPorId(categoriaId)) {
      throw erro(422, 'A categoria informada não existe');
    }

    return receitaModel.inserir({ titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId });
  },

  atualizar(id, dados = {}) {
    // 404 primeiro: não faz sentido validar dados de algo que não existe
    this.buscarPorId(id);

    const { titulo, modoPreparo, tempoPreparoMin, porcoes, categoriaId } = dados;
    const campos = {};

    if (titulo !== undefined) {
      if (!textoValido(titulo)) throw erro(400, 'Campo "titulo" não pode ser vazio');
      campos.titulo = titulo.trim();
    }
    if (modoPreparo !== undefined) {
      if (!textoValido(modoPreparo)) throw erro(400, 'Campo "modoPreparo" não pode ser vazio');
      campos.modoPreparo = modoPreparo.trim();
    }
    if (tempoPreparoMin !== undefined) {
      if (!inteiroPositivo(tempoPreparoMin)) {
        throw erro(400, 'Campo "tempoPreparoMin" deve ser um inteiro maior que 0');
      }
      campos.tempoPreparoMin = tempoPreparoMin;
    }
    if (porcoes !== undefined) {
      if (!inteiroPositivo(porcoes)) {
        throw erro(400, 'Campo "porcoes" deve ser um inteiro maior que 0');
      }
      campos.porcoes = porcoes;
    }
    if (categoriaId !== undefined) {
      if (!categoriaModel.buscarPorId(categoriaId)) {
        throw erro(422, 'A categoria informada não existe');
      }
      campos.categoriaId = categoriaId;
    }

    return receitaModel.atualizar(id, campos);
  },

  remover(id) {
    const removido = receitaModel.remover(id);
    if (!removido) throw erro(404, 'Receita não encontrada');
  },
};