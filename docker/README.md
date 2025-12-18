# Docker Development Setup

Este guia explica como rodar o projeto usando Docker para desenvolvimento local.

## Pré-requisitos

- Docker Desktop instalado
- Docker Compose v2+

## Quick Start

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Subir todos os serviços
pnpm docker:up

# 3. Verificar se está rodando
pnpm docker:ps
```

## Serviços Disponíveis

| Serviço  | URL                   | Descrição                 |
| -------- | --------------------- | ------------------------- |
| Web      | http://localhost:3000 | Frontend React (Vite HMR) |
| API      | http://localhost:3001 | Backend Fastify           |
| Postgres | localhost:5432        | Banco de dados            |
| Adminer  | http://localhost:8080 | UI para gerenciar o banco |

## Comandos Disponíveis

```bash
# Subir serviços
pnpm docker:up

# Derrubar serviços
pnpm docker:down

# Ver logs de todos os serviços
pnpm docker:logs

# Ver logs específicos
pnpm docker:logs:api
pnpm docker:logs:web

# Rebuild das imagens
pnpm docker:build

# Reiniciar serviços
pnpm docker:restart

# Limpar tudo (volumes, imagens)
pnpm docker:clean

# Ver status dos containers
pnpm docker:ps
```

## Acessando o Banco de Dados

### Via Adminer (UI)

1. Acesse http://localhost:8080
2. Sistema: PostgreSQL
3. Servidor: postgres
4. Usuário: postgres
5. Senha: postgres
6. Base de dados: sociodotabuleiro

### Via CLI

```bash
docker compose exec postgres psql -U postgres -d sociodotabuleiro
```

## Health Check

A API expõe um endpoint de health check:

```bash
curl http://localhost:3001/healthz
```

Resposta esperada:

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## Prisma Commands (dentro do Docker)

```bash
# Gerar client
docker compose exec api pnpm db:generate

# Rodar migrations
docker compose exec api pnpm db:migrate

# Seed do banco
docker compose exec api pnpm db:seed

# Abrir Prisma Studio (porta 5555)
docker compose exec api pnpm db:studio
```

## Hot Reload

Ambos os serviços (API e Web) suportam hot reload:

- **API**: Usa `tsx watch` para recarregar automaticamente
- **Web**: Usa Vite HMR para atualizações instantâneas

Os volumes estão configurados para sincronizar as pastas `src/` automaticamente.

## Troubleshooting

### Erro de conexão com o banco

```bash
# Verificar se o postgres está rodando
docker compose ps postgres

# Ver logs do postgres
docker compose logs postgres

# Reiniciar o postgres
docker compose restart postgres
```

### Erro de permissão

```bash
# Limpar volumes e reconstruir
pnpm docker:clean
pnpm docker:build
pnpm docker:up
```

### Porta já em uso

Edite o arquivo `.env` e altere as portas:

```env
POSTGRES_PORT=5433
API_PORT=3002
WEB_PORT=3001
```

## Desenvolvimento sem Docker

Se preferir rodar sem Docker:

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar .env com DATABASE_URL apontando para seu Postgres local

# 3. Gerar Prisma client
pnpm db:generate

# 4. Rodar migrations
pnpm db:migrate

# 5. Rodar API e Web simultaneamente
pnpm dev

# Ou separadamente:
pnpm dev:api
pnpm dev:web
```
