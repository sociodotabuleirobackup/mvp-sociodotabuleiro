
# Relatório da Tarefa 04: RLS (Row Level Security)

## 1. Implementação
O isolamento de dados foi aplicado utilizando o motor de políticas do Postgres nativo do Supabase.

- **Arquivos**: `packages/db/prisma/migrations/20251027000000_rls/migration.sql`
- **Tabelas Protegidas**: 12 tabelas principais.
- **Lógica**: Baseada em `auth.uid()` e funções de apoio para legibilidade.

## 2. Como Aplicar

### Desenvolvimento (Local/Dev)
Para aplicar essa migração SQL editada manualmente:

```bash
# 1. Crie a pasta da migração se não existir
# 2. Rode o comando para sincronizar o banco
pnpm --filter @socio/db db:migrate:dev
```

*Nota: O Prisma detectará o arquivo SQL na pasta de migrations e o aplicará.*

### Produção (Vercel/Supabase)
```bash
pnpm --filter @socio/db db:migrate:deploy
```

## 3. Checklist de Testes (Simulação)

- [ ] **Teste 01 (Jogador A)**: Tenta ler mensagens de um `chat_thread` onde seu ID não está em `participant_ids`. 
  - *Resultado esperado: Retorno vazio (404/Empty Selection).*
- [ ] **Teste 02 (Mestre B)**: Tenta atualizar o `status` de uma sessão criada pelo Mestre C.
  - *Resultado esperado: Erro de permissão (Unauthorized).*
- [ ] **Teste 03 (Público)**: Tenta ler `sessions` com status `draft`.
  - *Resultado esperado: Apenas o `master_id` criador consegue ver.*
- [ ] **Teste 04 (Admin)**: Acessa `ledger_entries` de qualquer usuário.
  - *Resultado esperado: Sucesso (via função `is_admin`).*
