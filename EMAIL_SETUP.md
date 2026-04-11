📧 **GUIA DE CONFIGURAÇÃO DE EMAIL**

## Usando Gmail com App Password

### Passo 1: Ativar Autenticação em Duas Etapas
1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá para "Segurança" (lateral esquerda)
3. Ative "Autenticação em duas etapas"

### Passo 2: Gerar Senha de App
1. Ainda em "Segurança", procure por "Senhas de app"
2. Selecione:
   - **App**: "Mail"
   - **Device**: "Windows, Mac ou Linux"
3. Clique em "Gerar"
4. Copie a senha gerada (16 caracteres sem espaços)

### Passo 3: Configurar no Projeto
1. Crie um arquivo `.env` na raiz do projeto
2. Copie o conteúdo de `.env.example`
3. Substitua pelos dados do seu Gmail:

```
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Passo 4: Instalar Dependências
```bash
npm install
```

### Passo 5: Iniciar Servidor
```bash
npm start
```

## 🔔 O que acontece quando um time se cadastra?

✅ **Email para Admin** (josecarlos.futebol@gmail.com)
- Notificação de novo cadastro
- Dados completos do time

✅ **Email para o Time**
- Confirmação de cadastro
- Links de contato (WhatsApp e Instagram)

---

**⚠️ Importante**: Nunca compartilhe a senha de app públicamente!
