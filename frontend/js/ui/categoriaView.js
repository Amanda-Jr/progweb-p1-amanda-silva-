// Camada de UI: a única que toca no DOM das categorias.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-categoria'),
  salvar: document.querySelector('#cat-salvar'),
  cancelar: document.querySelector('#cat-cancelar'),
  carregando: document.querySelector('#categorias-carregando'),
  erro: document.querySelector('#categorias-erro'),
  erroMsg: document.querySelector('#categorias-erro-msg'),
  recarregar: document.querySelector('#categorias-recarregar'),
  vazio: document.querySelector('#categorias-vazio'),
  sucesso: document.querySelector('#categorias-sucesso'),
  linhas: document.querySelector('#categorias-linhas'),
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

function linha(categoria, editandoId) {
  const tr = document.createElement('tr');
  if (categoria.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', categoria.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', categoria.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(categoria.id),
    celula(categoria.nome),
    celula(categoria.descricao ?? '—'),
    acoes,
  );
  return tr;
}

export const categoriaView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, categorias, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...categorias.map((c) => linha(c, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar categoria';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(categoria) {
    el.form.nome.value = categoria.nome;
    el.form.descricao.value = categoria.descricao ?? '';
    el.form.nome.focus();
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