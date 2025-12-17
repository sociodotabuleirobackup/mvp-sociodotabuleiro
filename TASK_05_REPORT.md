
# Relatório da Tarefa 05: Integração Fastify + Prisma

## 1. Arquivos Criados/Alterados
- `apps/api/package.json`: Definição de scripts e dependências (Fastify, Zod, Prisma).
- `apps/api/src/plugins/prisma.ts`: Plugin para injeção de dependência do `@socio/db`.
- `apps/api/src/routes/health.ts`: Endpoint de monitoramento.
- `apps/api/src/routes/sessions.ts`: Lógica de CRUD inicial para o marketplace de mesas.
- `apps/api/src/index.ts`: Ponto de entrada do servidor.

## 2. Comandos para Rodar Localmente

Certifique-se de que o banco de dados (Supabase) está configurado no arquivo `.env` do pacote `@socio/db`.

```bash
# Na raiz do projeto
pnpm install

# Gerar o Prisma Client (necessário para o TS reconhecer os tipos)
pnpm --filter @socio/db db:generate

# Iniciar o servidor em modo watch (recarregamento automático)
pnpm --filter @socio/api dev
```

## 3. Exemplos de Teste (cURL)

**Health Check:**
```bash
curl http://localhost:3333/healthz
```

**Listar Mesas:**
```bash
curl http://localhost:3333/api/sessions
```

**Criar Mesa (Simulando Auth):**
```bash
curl -X POST http://localhost:3333/api/sessions \
  -H "Content-Type: application/json" \
  -H "x-user-id: seed_master_001" \
  -d '{
    "title": "Aventura de Teste API",
    "system": "D&D 5e",
    "date": "2025-10-30T19:00:00Z",
    "price": 25.0,
    "playersMax": 4,
    "locationType": "ONLINE"
  }'
```

## 4. Checklist de Validação
- [ ] O servidor inicia sem erros de conexão com o banco.
- [ ] O header `x-user-id` é obrigatório para criação de sessões.
- [ ] Dados inválidos (ex: preço negativo) são barrados pelo Zod (HTTP 400).
- [ ] Logs formatados aparecem no terminal via `pino-pretty`.
