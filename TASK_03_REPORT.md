
# Relatório da Tarefa 03: Migration e Seed

## 1. Escopo Implementado
- Configuração completa do `schema.prisma` com relações e tipos monetários (`Decimal`).
- Script de `seed.ts` populando usuários de teste, lojas, mesas, sessões e histórico de chat.
- Automação de scripts no `package.json`.

## 2. Comandos de Execução

### No Ambiente de Desenvolvimento (Dev)
Sempre que alterar o schema ou quiser resetar o banco com dados de teste:

```bash
# Executar a partir da raiz do monorepo
# 1. Aplicar migrations e rodar o seed automaticamente
pnpm --filter @socio/db db:migrate:dev

# OU se quiser apenas rodar o seed novamente (limpando e recriando)
pnpm --filter @socio/db db:seed
```

### No Ambiente de Produção (Deploy)
A Vercel ou o pipeline de CI deve rodar:

```bash
# Apenas aplica migrations pendentes sem resetar dados
pnpm --filter @socio/db db:migrate:deploy
```

## 3. Checklist de Validação
- [ ] O comando `db:migrate:dev` criou as tabelas `profiles`, `venues`, `sessions`, etc.
- [ ] O seed inseriu o usuário "Mestre Alex" e o "Aventureiro John".
- [ ] A sessão "A Maldição de Strahd" aparece vinculada à "Caverna do Dragão".
- [ ] O chat thread contém as 2 mensagens iniciais trocadas.
