import { receitaModel } from '../models/receitaModel.js';
import { categoriaModel } from '../models/categoriaModel.js';
import { erro } from '../utils/erro.js';

// nome precisa ser um texto com algo além de espaços
const nomeValido = (nome) => typeof nome === 'string' && nome.trim() !== '';

export const categoriaService = {
  listar() {
    return categoriaModel.listar();
  },

  buscarPorId(id) {
    const categoria = categoriaModel.buscarPorId(id);
    if (!categoria) throw erro(404, 'Categoria não encontrada');
    return categoria;
  },

  criar({ nome, descricao } = {}) {
    // Regra 1: nome é obrigatório
    if (!nomeValido(nome)) throw erro(400, 'Campo "nome" é obrigatório');
    // Regra 2: nome é único
    if (categoriaModel.existeNome(nome)) {
      throw erro(409, 'Já existe uma categoria com este nome');
    }
    return categoriaModel.inserir({ nome, descricao });
  },

  atualizar(id, dados = {}) {
    // 404 primeiro: não faz sentido validar dados de algo que não existe
    this.buscarPorId(id);

    const { nome, descricao } = dados;
    const campos = {};

    if (nome !== undefined) {
      if (!nomeValido(nome)) throw erro(400, 'Campo "nome" não pode ser vazio');
      // ignora a própria categoria, para poder reenviar o mesmo nome
      if (categoriaModel.existeNome(nome, id)) {
        throw erro(409, 'Já existe uma categoria com este nome');
      }
      campos.nome = nome.trim();
    }
    if (descricao !== undefined) campos.descricao = descricao;

    return categoriaModel.atualizar(id, campos);
  },

  remover(id) {
    this.buscarPorId(id); // 404 se não existir
    // Não deixa receitas órfãs: categoria com receitas não pode ser removida
    if (receitaModel.listarPorCategoria(id).length > 0) {
      throw erro(409, 'Não é possível remover: existem receitas nesta categoria');
    }
    categoriaModel.remover(id);
  },
  
};