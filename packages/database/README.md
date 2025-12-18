# Database Package

Este package gerencia o schema Prisma, migrations e seeds do projeto.

## 📋 Schema Overview

O schema cobre todos os requisitos do MVP:

### Core Models
- **User** - Usuários do sistema (Players, Masters, Store Owners, Admins)
- **MasterProfile** - Perfil estendido para Mestres
- **StoreProfile** - Perfil estendido para Lojistas

### Venue & Tables
- **Venue** - Estabelecimentos físicos para sessões
- **Table** - Mesas dentro dos estabelecimentos

### Sessions & Bookings
- **Session** - Sessões de RPG (online ou presencial)
- **Booking** - Reservas de jogadores nas sessões

### Payments & Subscriptions
- **Payment** - Pagamentos (sessões, assinaturas, etc.)
- **Subscription** - Assinaturas mensais/anuais

### Chat & Notifications
- **Chat** - Salas de chat (por sessão, direto, grupo)
- **ChatMessage** - Mensagens nos chats
- **Notification** - Notificações do sistema

### Marketplace
- **Adventure** - Aventuras/módulos à venda
- **Purchase** - Compras de aventuras

### Food System
- **FoodMenu** - Cardápios dos estabelecimentos
- **FoodItem** - Items do cardápio
- **FoodOrder** - Pedidos de comida
- **FoodOrderItem** - Items dos pedidos

### Gamification
- **Achievement** - Conquistas disponíveis
- **UserAchievement** - Conquistas desbloqueadas pelos usuários

### Financial
- **LedgerEntry** - Registro financeiro (créditos, débitos, comissões)

### Reviews
- **Review** - Avaliações de sessões

## 🚀 Comandos

### Gerar Prisma Client
```bash
pnpm db:generate
```

### Criar Migration
```bash
pnpm db:migrate
# Será solicitado um nome para a migration
```

### Aplicar Migrations (sem criar nova)
```bash
pnpm db:push
```

### Resetar Database (⚠️ CUIDADO - apaga tudo)
```bash
pnpm db:reset
# Isso vai:
# 1. Dropar o banco
# 2. Recriar o banco
# 3. Aplicar todas as migrations
# 4. Rodar o seed automaticamente
```

### Rodar Seed
```bash
pnpm db:seed
```

### Abrir Prisma Studio (UI para visualizar dados)
```bash
pnpm db:studio
# Abre em http://localhost:5555
```

## 🌱 Seed Data

O seed cria dados de exemplo para desenvolvimento:

### Usuários
- **Mestre**: mestre@sociodotabuleiro.com
- **Jogador**: jogador@sociodotabuleiro.com
- **Lojista**: loja@sociodotabuleiro.com

### Estabelecimento
- **Caverna do Dragão** - Espaço gamer em São Paulo
  - Mesa 1 (capacidade 6)
  - Mesa 2 (capacidade 8)

### Sessões
1. **A Maldição de Strahd** (Presencial)
   - D&D 5e
   - 25/01/2025 às 14h
   - R$ 45,00
   - Na Caverna do Dragão

2. **Cyberpunk RED** (Online)
   - Cyberpunk RED
   - 27/01/2025 às 19h
   - R$ 35,00

### Outros Dados
- 1 Booking confirmado (Jogador na sessão de Strahd)
- 1 Chat com 3 mensagens
- 2 Notificações
- 3 Items no cardápio
- 3 Conquistas
- 1 Review (5 estrelas)
- 2 Entradas no ledger financeiro

## 🔄 Workflow Completo

### Setup Inicial
```bash
# 1. Gerar Prisma Client
pnpm db:generate

# 2. Criar e aplicar migrations
pnpm db:migrate

# 3. Popular com dados de exemplo
pnpm db:seed
```

### Durante Desenvolvimento

#### Mudou o schema?
```bash
# 1. Criar migration
pnpm db:migrate
# Digite um nome descritivo: "add_user_phone_field"

# 2. Gerar novo client
pnpm db:generate
```

#### Quer resetar tudo?
```bash
# Reseta banco e roda seed automaticamente
pnpm db:reset
```

#### Quer apenas atualizar dados?
```bash
# Roda seed novamente (é idempotente)
pnpm db:seed
```

## 🐳 Com Docker

Se estiver usando Docker Compose:

```bash
# Gerar client dentro do container
docker compose exec api pnpm db:generate

# Rodar migrations
docker compose exec api pnpm db:migrate

# Rodar seed
docker compose exec api pnpm db:seed

# Resetar banco
docker compose exec api pnpm db:reset

# Abrir Prisma Studio
docker compose exec api pnpm db:studio
```

## 📝 Variáveis de Ambiente

Certifique-se de ter estas variáveis no `.env`:

```env
# Para desenvolvimento local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sociodotabuleiro?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/sociodotabuleiro?schema=public"

# Para Docker
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/sociodotabuleiro?schema=public"
DIRECT_URL="postgresql://postgres:postgres@postgres:5432/sociodotabuleiro?schema=public"
```

## 🔍 Explorando os Dados

### Via Prisma Studio
```bash
pnpm db:studio
# Abre interface visual em http://localhost:5555
```

### Via Adminer (Docker)
```bash
pnpm docker:up
# Acesse http://localhost:8080
# Sistema: PostgreSQL
# Servidor: postgres
# Usuário: postgres
# Senha: postgres
# Base: sociodotabuleiro
```

### Via psql
```bash
# Local
psql postgresql://postgres:postgres@localhost:5432/sociodotabuleiro

# Docker
docker compose exec postgres psql -U postgres -d sociodotabuleiro
```

## 🎯 Queries Úteis

```sql
-- Ver todos os usuários
SELECT * FROM users;

-- Ver sessões com mestres
SELECT s.*, u.name as master_name 
FROM sessions s
JOIN master_profiles mp ON s.master_id = mp.id
JOIN users u ON mp.user_id = u.id;

-- Ver bookings confirmados
SELECT b.*, u.name as player_name, s.title as session_title
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN sessions s ON b.session_id = s.id
WHERE b.status = 'CONFIRMED';

-- Ver mensagens de chat
SELECT cm.*, u.name as sender_name
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
ORDER BY cm.created_at;
```

## 🚨 Troubleshooting

### Erro: "Can't reach database server"
```bash
# Verifique se o Postgres está rodando
docker compose ps postgres

# Ou localmente
pg_isready -h localhost -p 5432
```

### Erro: "Migration failed"
```bash
# Resete o banco e tente novamente
pnpm db:reset
```

### Erro: "Prisma Client not generated"
```bash
# Gere o client
pnpm db:generate
```

### Seed falha ao rodar segunda vez
O seed é idempotente e usa `upsert` para evitar duplicatas. Se falhar:
```bash
# Resete e rode novamente
pnpm db:reset
```