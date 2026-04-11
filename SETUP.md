# 🏆 Guega Esportes - Banco de Dados de Times

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```

O servidor rodará em `http://localhost:3000`

## 📊 Banco de Dados

### Estrutura da Tabela `times`
- **id**: Identificador único (auto-incremento)
- **nome_pessoa**: Nome do responsável pelo time
- **email**: Email do responsável (único)
- **nome_time**: Nome do time (único)
- **data_cadastro**: Data e hora do cadastro (automático)

### Banco de Dados
- Arquivo: `banco_dados.db` (SQLite)
- Criado automaticamente na primeira execução

## 🔌 API REST

### Endpoints Disponíveis

#### GET - Listar todos os times
```
GET /api/times
```

#### GET - Obter um time específico
```
GET /api/times/:id
```

#### POST - Cadastrar novo time
```
POST /api/times
Content-Type: application/json

{
  "nome_pessoa": "João Silva",
  "email": "joao@email.com",
  "nome_time": "FC Guega"
}
```

#### PUT - Atualizar um time
```
PUT /api/times/:id
Content-Type: application/json

{
  "nome_pessoa": "João Silva",
  "email": "joao@email.com",
  "nome_time": "FC Guega Novo"
}
```

#### DELETE - Deletar um time
```
DELETE /api/times/:id
```

## 💡 Exemplos de Uso

### Cadastrar um novo time com cURL
```bash
curl -X POST http://localhost:3000/api/times \
  -H "Content-Type: application/json" \
  -d '{
    "nome_pessoa": "Maria Santos",
    "email": "maria@email.com",
    "nome_time": "Guega United"
  }'
```

### Listar todos os times
```bash
curl http://localhost:3000/api/times
```

### Deletar um time
```bash
curl -X DELETE http://localhost:3000/api/times/1
```

## 🎯 Funcionalidades

- ✅ Cadastro de times via formulário web
- ✅ Listagem de times em tempo real
- ✅ Banco de dados persistente com SQLite
- ✅ Validação de campos obrigatórios
- ✅ Prevenção de emails e nomes de times duplicados
- ✅ API REST completa (CRUD)
- ✅ Interface responsiva

## 📝 Notas

- O banco de dados é criado automaticamente na primeira execução
- Emails e nomes de times não podem ser duplicados
- O servidor está configurado para servir arquivos estáticos (HTML, CSS, JS)
- CORS está habilitado para requisições cross-origin

---

**Desenvolvido para Guega Esportes 🏅**
