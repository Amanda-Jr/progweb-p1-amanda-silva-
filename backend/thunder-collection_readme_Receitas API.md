# Thunder Client API Documentation

## Collection: Receitas API

**Base URL:** `http://localhost:3000`

### Requests (No Folder)

### POST /categorias
- **Name**: post01

**Request Body** (json):

```json
{"nome":"Sobremesa","descricao":"Doces em geral"} 
```

---

### POST /categorias
- **Name**: post02

**Request Body** (json):

```json
{"nome":"Massa"} 
```

---

### POST /receitas
- **Name**: post03

**Request Body** (json):

```json
{"titulo":"Pudim","modoPreparo":"Bata e asse em banho-maria","tempoPreparoMin":90,"porcoes":8,"categoriaId":1}
```

---

### POST /receitas
- **Name**: post04

**Request Body** (json):

```json
{"titulo":"Macarrão alho e óleo","modoPreparo":"Cozinhe a massa e refogue o alho","tempoPreparoMin":20,"porcoes":2,"categoriaId":2}
```

---

### GET /categorias
- **Name**: get05


---

### GET /receitas
- **Name**: get06


---

### GET /receitas
- **Name**: get07
- **Query Params**:
  - `categoriaId`: `1`


---

### GET /receitas/1
- **Name**: get08


---

### GET /categorias/1
- **Name**: get09


---

### GET /receitas/99
- **Name**: get10


---

### GET /categorias/99
- **Name**: get11


---

### POST /categorias
- **Name**: post12


---

### POST /categorias
- **Name**: post13

**Request Body** (json):

```json
{"nome":"sobremesa"} 
```

---

### POST /receitas
- **Name**: post14

**Request Body** (json):

```json
{"titulo":"Bolo"} 
```

---

### POST /receitas
- **Name**: post15

**Request Body** (json):

```json
{
  "titulo":"Bolo",
  "modoPreparo":"Asse",
  "tempoPreparoMin":40,
  "porcoes":0,
  "categoriaId":1
  
}
```

---

### POST /receitas
- **Name**: post16

**Request Body** (json):

```json
{"titulo":"Bolo","modoPreparo":"Asse","tempoPreparoMin":-5,"porcoes":6,"categoriaId":1}
```

---

### POST /receitas
- **Name**: post17

**Request Body** (json):

```json
{"titulo":"Bolo","modoPreparo":"Asse","tempoPreparoMin":40,"porcoes":6,"categoriaId":999}
```

---

### PUT /categorias/1
- **Name**: put18

**Request Body** (json):

```json
{"descricao":"Doces e sobremesas"} 
```

---

### PUT /receitas/1
- **Name**: put19

**Request Body** (json):

```json
{"porcoes":10}
```

---

### PUT /receitas/1
- **Name**: put20

**Request Body** (json):

```json
{"categoriaId":999} 
```

---

### DELETE /categorias/1
- **Name**: delete21


---

### DELETE /receitas/1
- **Name**: delete22


---

### DELETE /receitas/99
- **Name**: delete23


---

### DELETE /categorias/1
- **Name**: delete24


---

