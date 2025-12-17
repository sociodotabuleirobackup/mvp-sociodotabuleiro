# Relatório da Tarefa 02: Modelagem (Schema)

## 1. Alterações
- **Arquivo**: `packages/db/prisma/schema.prisma`
- **Ação**: Implementação completa do modelo de dados relacional.
- **Destaques**:
  - `User` mapeado para `profiles`.
  - Enums para padronização de status e tipos.
  - Relações configuradas com *Cascade Delete* onde apropriado (ex: items de pedido).
  - Uso de `Decimal` para valores monetários (melhor precisão que Float).

## 2. Comandos para Aplicação

Execute na raiz do monorepo para criar a migração inicial no banco de dados (Supabase):

```bash
# 1. Gerar os artefatos do Prisma Client atualizados
pnpm --filter @socio/db db:generate

# 2. Criar a migração SQL e aplicar no banco
# Isso criará todas as tabelas no schema public do Postgres
pnpm --filter @socio/db db:migrate:dev --name init_full_schema
```

## 3. Checklist de Validação

- [ ] Verificar se todas as tabelas foram criadas no Supabase (Table Editor).
- [ ] Verificar se os Enums foram criados corretamente no banco.
- [ ] Validar se a relação `User` -> `profiles` está alinhada com a estratégia de Auth do Supabase (triggers serão necessários na próxima etapa para sync).
