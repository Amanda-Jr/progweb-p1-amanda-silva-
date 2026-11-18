// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { categoriaService } from './services/categoriaService.js';
import { categoriaView } from './ui/categoriaView.js';
import { aviso } from './ui/aviso.js';

// ===================== CATEGORIAS =====================
const categorias = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  categorias: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
categorias.assinar(categoriaView.render);

async function carregarCategorias() {
  categorias.set({ status: 'carregando', erro: null });
  try {
    const lista = await categoriaService.listar();
    categorias.set({ status: lista.length ? 'sucesso' : 'vazio', categorias: lista });
  } catch (e) {
    categorias.set({ status: 'erro', erro: e.message });
  }
}

async function salvarCategoria(dados) {
  const { editandoId } = categorias.get();
  aviso.limpar();
  categorias.set({ salvando: true });
  try {
    if (editandoId) await categoriaService.atualizar(editandoId, dados);
    else await categoriaService.criar(dados);

    aviso.sucesso(editandoId ? 'Categoria atualizada.' : 'Categoria cadastrada.');
    categoriaView.limparForm();
    categorias.set({ editandoId: null });
    await carregarCategorias();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    categorias.set({ salvando: false });
  }
}

function editarCategoria(id) {
  const categoria = categorias.get().categorias.find((c) => c.id === id);
  categoriaView.preencherForm(categoria);
  categorias.set({ editandoId: id });
}

function cancelarEdicaoCategoria() {
  categoriaView.limparForm();
  categorias.set({ editandoId: null });
}

async function removerCategoria(id) {
  if (!confirm(`Remover a categoria #${id}?`)) return;
  aviso.limpar();
  try {
    await categoriaService.remover(id);
    aviso.sucesso('Categoria removida.');
    if (categorias.get().editandoId === id) cancelarEdicaoCategoria();
    await carregarCategorias();
  } catch (e) {
    aviso.erro(e.message);
  }
}

categoriaView.aoEnviar(salvarCategoria);
categoriaView.aoCancelar(cancelarEdicaoCategoria);
categoriaView.aoRecarregar(carregarCategorias);
categoriaView.aoClicarNaLista({ editar: editarCategoria, remover: removerCategoria });


// ===================== RECEITAS =====================
const receitas = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  receitas: [],
  categorias: [], // cópia da lista do pai, só para a tabela mostrar o nome
  erro: null,
  editandoId: null,
  salvando: false,
});

receitas.assinar(receitaView.render);

// Quando a lista do pai muda, religa o <select> e atualiza os nomes na tabela.
categorias.assinar(({ categorias: lista }) => {
  receitaView.preencherCategorias(lista);
  receitas.set({ categorias: lista });
});

async function carregarReceitas() {
  receitas.set({ status: 'carregando', erro: null });
  try {
    const lista = await receitaService.listar();
    receitas.set({ status: lista.length ? 'sucesso' : 'vazio', receitas: lista });
  } catch (e) {
    receitas.set({ status: 'erro', erro: e.message });
  }
}

async function salvarReceita(dados) {
  const { editandoId } = receitas.get();
  aviso.limpar();
  receitas.set({ salvando: true });
  try {
    if (editandoId) await receitaService.atualizar(editandoId, dados);
    else await receitaService.criar(dados);

    aviso.sucesso(editandoId ? 'Receita atualizada.' : 'Receita cadastrada.');
    receitaView.limparForm();
    receitas.set({ editandoId: null });
    await carregarReceitas();
  } catch (e) {
    aviso.erro(e.message); // inclui o 422 da API; o formulário fica como está
  } finally {
    receitas.set({ salvando: false });
  }
}

function editarReceita(id) {
  const receita = receitas.get().receitas.find((r) => r.id === id);
  receitaView.preencherForm(receita);
  receitas.set({ editandoId: id });
}

function cancelarEdicaoReceita() {
  receitaView.limparForm();
  receitas.set({ editandoId: null });
}

async function removerReceita(id) {
  if (!confirm(`Remover a receita #${id}?`)) return;
  aviso.limpar();
  try {
    await receitaService.remover(id);
    aviso.sucesso('Receita removida.');
    if (receitas.get().editandoId === id) cancelarEdicaoReceita();
    await carregarReceitas();
  } catch (e) {
    aviso.erro(e.message);
  }
}

receitaView.aoEnviar(salvarReceita);
receitaView.aoCancelar(cancelarEdicaoReceita);
receitaView.aoRecarregar(carregarReceitas);
receitaView.aoClicarNaLista({ editar: editarReceita, remover: removerReceita });


// ===================== INÍCIO =====================
carregarCategorias();
carregarReceitas();