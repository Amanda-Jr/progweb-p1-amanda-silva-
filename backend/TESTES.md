# Testes da API — Projeto 1 (S3)

API: Catálogo de Receitas · entidades: Categoria e Receita · servidor: `npm run dev` em http://localhost:3000

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | POST | /categorias | {"nome":"Sobremesa","descricao":"Doces em geral"} | 201 | cria a categoria de id 1 |
| 2 | POST | /categorias | {"nome":"Massa"} | 201 | cria a categoria de id 2 |
| 3 | POST | /receitas | {"titulo":"Pudim","modoPreparo":"Bata e asse em banho-maria","tempoPreparoMin":90,"porcoes":8,"categoriaId":1} | 201 | |
| 4 | POST | /receitas | {"titulo":"Macarrão alho e óleo","modoPreparo":"Cozinhe a massa e refogue o alho","tempoPreparoMin":20,"porcoes":2,"categoriaId":2} | 201 | |
| 5 | GET | /categorias | — | 200 | lista as 2 categorias |
| 6 | GET | /receitas | — | 200 | lista as 2 receitas |
| 7 | GET | /receitas?categoriaId=1 | — | 200 | filtro 1:N, só o Pudim |
| 8 | GET | /receitas/1 | — | 200 | |
| 9 | GET | /categorias/1 | — | 200 | |
| 10 | GET | /receitas/99 | — | 404 | receita inexistente |
| 11 | GET | /categorias/99 | — | 404 | categoria inexistente |
| 12 | POST | /categorias | {} | 400 | regra: nome obrigatório |
| 13 | POST | /categorias | {"nome":"sobremesa"} | 409 | regra: nome único (ignora maiúsculas) |
| 14 | POST | /receitas | {"titulo":"Bolo"} | 400 | faltam campos obrigatórios |
| 15 | POST | /receitas | {"titulo":"Bolo","modoPreparo":"Asse","tempoPreparoMin":40,"porcoes":0,"categoriaId":1} | 400 | regra: porções > 0 |
| 16 | POST | /receitas | {"titulo":"Bolo","modoPreparo":"Asse","tempoPreparoMin":-5,"porcoes":6,"categoriaId":1} | 400 | regra: tempo > 0 |
| 17 | POST | /receitas | {"titulo":"Bolo","modoPreparo":"Asse","tempoPreparoMin":40,"porcoes":6,"categoriaId":999} | 422 | categoria não existe |
| 18 | PUT | /categorias/1 | {"descricao":"Doces e sobremesas"} | 200 | |
| 19 | PUT | /receitas/1 | {"porcoes":10} | 200 | |
| 20 | PUT | /receitas/1 | {"categoriaId":999} | 422 | não move para categoria inexistente |
| 21 | DELETE | /categorias/1 | — | 409 | regra: categoria ainda tem receitas |
| 22 | DELETE | /receitas/1 | — | 204 | |
| 23 | DELETE | /receitas/99 | — | 404 | |
| 24 | DELETE | /categorias/1 | — | 204 | agora sem receitas |