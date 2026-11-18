// Camada de UI: a única que toca no DOM das receitas.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-receita'),
  categoria: document.querySelector('#rec-categoria'),
  salvar: document.querySelector('#rec-salvar'),
  cancelar: document.querySelector('#rec-cancelar'),
  carregando: document.querySelector('#receitas-carregando'),
  erro: document.querySelector('#receitas-erro'),
  erroMsg: document.querySelector('#receitas-erro-msg'),
  recarregar: document.querySelector('#receitas-recarregar'),
  vazio: document.querySelector('#receitas-vazio'),
  sucesso: document.querySelector('#receitas-sucesso'),
  linhas: document.querySelector('#receitas-linhas'),
};

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto; // dado do usuário entra como TEXTO, nunca como HTML
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao; // vira data-acao="editar" no HTML
  b.dataset.id = id;
  return b;
}

function linha(receita, editandoId, nomesCategorias) {
  const tr = document.createElement('tr');
  if (receita.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', receita.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', receita.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(receita.id),
    celula(receita.titulo),
    celula(nomesCategorias.get(receita.categoriaId) ?? `#${receita.categoriaId}`),
    celula(`${receita.tempoPreparoMin} min`, 'text-nowrap'),
    celula(receita.porcoes),
    acoes,
  );
  return tr;
}

export const receitaView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, receitas, categorias, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';

    // id -> nome, para a coluna "Categoria" mostrar o nome em vez do número
    const nomes = new Map(categorias.map((c) => [c.id, c.nome]));
    el.linhas.replaceChildren(...receitas.map((r) => linha(r, editandoId, nomes)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar receita';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  // Recria as <option> do <select> a partir da lista de categorias (o "pai").
  preencherCategorias(lista) {
    const atual = el.categoria.value; // guarda a escolha para não perdê-la
    el.categoria.replaceChildren(
      new Option('Selecione…', ''),
      ...lista.map((c) => new Option(c.nome, c.id)), // nome entra como texto
    );
    if (lista.some((c) => String(c.id) === atual)) el.categoria.value = atual;
  },

  preencherForm(receita) {
    el.form.titulo.value = receita.titulo;
    el.form.modoPreparo.value = receita.modoPreparo;
    el.form.tempoPreparoMin.value = receita.tempoPreparoMin;
    el.form.porcoes.value = receita.porcoes;
    el.form.categoriaId.value = receita.categoriaId;
    el.form.titulo.focus();
  },

  limparForm() {
    el.form.reset();
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault(); // sem isto, o navegador recarrega a página
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  // Delegação: UM listener no <tbody> atende os botões de todas as linhas.
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id); // tudo que vem do DOM é string
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};