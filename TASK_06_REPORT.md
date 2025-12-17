
# Relatório da Tarefa 06: Autenticação JWT Supabase

## 1. O que foi feito
- Implementação de middleware Fastify para verificação de JWT.
- Integração com JWKS do Supabase para validação criptográfica (sem precisar de secret local).
- Proteção da rota `POST /api/sessions` com validação de Role (`MASTER`) via banco de dados.
- Configuração de tipos TypeScript para `request.user`.

## 2. Configuração necessária (.env)
No diretório `apps/api` ou na raiz (se compartilhado), adicione:
```env
SUPABASE_URL=https://sua-url-do-supabase.supabase.co
```

## 3. Comandos para Rodar
```bash
pnpm install
pnpm --filter @socio/api dev
```

## 4. Guia de Testes

### Cenário 1: Acesso Público (Health & Listagem)
- **Ação**: `GET http://localhost:3333/api/sessions`
- **Esperado**: Lista de sessões (Status 200).

### Cenário 2: Token Ausente ou Inválido
- **Ação**: `POST http://localhost:3333/api/sessions` sem header ou com token lixo.
- **Esperado**: Erro 401 Unauthorized.

### Cenário 3: Usuário Autenticado mas sem Permissão (Role PLAYER)
- **Ação**: `POST http://localhost:3333/api/sessions` com JWT de um Jogador.
- **Esperado**: Erro 403 Forbidden.

### Cenário 4: Sucesso (Mestre Autenticado)
- **Ação**: `POST http://localhost:3333/api/sessions` com JWT de um Mestre.
- **Esperado**: Sessão criada (Status 201).

---
**Dica para testes**: Você pode obter um JWT de teste no console do navegador do seu frontend após logar:
`JSON.parse(localStorage.getItem('sb-<project-id>-auth-token')).access_token`
