import { receitaService } from '../services/receitaService.js';

export const receitaController = {
  listar(req, res) {
    // ?categoriaId=1 é opcional; chega como texto, então converte
    const { categoriaId } = req.query;
    const filtro = categoriaId === undefined ? undefined : Number(categoriaId);
    res.json(receitaService.listar(filtro));
  },

  buscarPorId(req, res) {
    res.json(receitaService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const nova = receitaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    res.json(receitaService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    receitaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};