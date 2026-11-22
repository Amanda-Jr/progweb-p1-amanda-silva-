
# Catálogo de Receitas

Sistema para cadastrar e consultar receitas culinárias organizadas por categoria (sobremesa, massa, salada etc.), pensado para quem quer manter um caderno de receitas digital.
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).

- **Aplicação:** https://SEU-FRONT.vercel.app
- **API:** https://SEU-SERVICO.onrender.com
- **Vídeo de apresentação:** (link)

> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.

## Tecnologias

- Backend: Node.js 22, Express 5, SQLite (`node:sqlite`, SQL puro)
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

O arquivo `.env` define `PORT`, `DB_FILE` e `CORS_ORIGIN` (a origem do front
liberada no CORS). Se o front rodar em outra porta (por exemplo 5501 no Live
Server do VS Code), ajuste `CORS_ORIGIN` e reinicie a API.

## Rotas da API

### Categorias

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | /categorias | Lista as categorias | 200 |
| POST | /categorias | Cria uma categoria | 201, 400, 409 |
| GET | /categorias/:id | Busca uma categoria | 200, 404 |
| PUT | /categorias/:id | Atualiza uma categoria | 200, 400, 404, 409 |
| DELETE | /categorias/:id | Remove uma categoria | 204, 404, 409 |

### Receitas

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | /receitas | Lista as receitas (aceita `?categoriaId=1`) | 200 |
| POST | /receitas | Cria uma receita | 201, 400, 422 |
| GET | /receitas/:id | Busca uma receita | 200, 404 |
| PUT | /receitas/:id | Atualiza uma receita | 200, 400, 404, 422 |
| DELETE | /receitas/:id | Remove uma receita | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`. Os testes de cada rota estão em
`backend/TESTES.md`.

## Regras de negócio

- **Categoria:** `nome` é obrigatório (400) e único, sem diferenciar maiúsculas de minúsculas (409).
- **Categoria:** não pode ser removida se ainda tiver receitas (409).
- **Receita:** `titulo`, `modoPreparo` e `categoriaId` são obrigatórios (400).
- **Receita:** `tempoPreparoMin` e `porcoes` devem ser inteiros maiores que 0 (400).
- **Receita:** a categoria informada em `categoriaId` precisa existir (422).

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL)
    middleware/    logger e tratamento de erros
    db.js          conexão, schema e dados de exemplo do SQLite
  TESTES.md        testes da API (Thunder Client)
frontend/
  js/
    api.js         camada HTTP (fetch)
    services/      regras da tela
    state/         estado da aplicação
    ui/            desenho da tela
  TELAS.md         estados de cada lista
MODELAGEM.md       modelagem de classes (S2)
s1/ … s4/          exercícios das semanas
```

## Autor

Amanda da Silva · Ciência da Computação · UEPB