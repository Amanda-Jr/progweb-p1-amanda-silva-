# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` (ou Live Server do VS Code) · API: `npm run dev` em `backend/`

## Estados das listas

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Categorias | carregando | Network → throttling 3G → F5 | spinner "Carregando categorias…" |
| Categorias | vazio | API recém-iniciada | "Nenhuma categoria ainda. Cadastre a primeira no formulário." |
| Categorias | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão Tentar de novo |
| Categorias | sucesso | cadastrar "Sobremesa" | tabela com 1 linha |
| Receitas | carregando | Network → throttling 3G → F5 | spinner "Carregando receitas…" |
| Receitas | vazio | API recém-iniciada | "Nenhuma receita ainda. Cadastre a primeira no formulário." |
| Receitas | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão Tentar de novo |
| Receitas | sucesso | cadastrar "Pudim" na categoria "Sobremesa" | tabela com 1 linha, coluna Categoria mostrando o nome |

## Erros de regra (vindos do backend)

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Categorias | erro de regra (409) | cadastrar "Sobremesa" duas vezes (ou "sobremesa") | aviso vermelho "Já existe uma categoria com este nome" |
| Categorias | erro de regra (409) | remover uma categoria que tem receitas | aviso vermelho "Não é possível remover: existem receitas nesta categoria" |
| Receitas | erro de regra (422) | no Thunder Client, `DELETE /categorias/N` (categoria sem receitas); sem recarregar o painel, cadastrar receita nessa categoria | aviso vermelho "A categoria informada não existe" |

## Validações feitas só no front (sem chamar a API)

| Lista | Como provocar | O que aparece |
|---|---|---|
| Categorias | enviar o formulário com Nome em branco | aviso "Informe o nome da categoria." |
| Receitas | enviar com Categoria em "Selecione…" | aviso "Escolha uma categoria." |
| Receitas | enviar com Porções = 0 | aviso "As porções devem ser um número inteiro maior que 0." |

## Camadas

- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`