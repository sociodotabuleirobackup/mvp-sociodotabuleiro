# Sócio do Tabuleiro

Marketplace para Mestres, Lojistas e Jogadores de RPG.

## 📁 Estrutura do Projeto

```
├── apps/
│   ├── api/                    # Backend API (Fastify + TypeScript)
│   ├── web/                    # Frontend Web (React + Vite)
│   └── mobile/                 # Mobile App (React Native + Expo)
├── packages/
│   ├── shared/                 # Código compartilhado (tipos, utils, constantes)
│   └── database/               # Schema e migrations (Prisma)
├── tools/
│   ├── scripts/                # Scripts de automação
│   ├── supabase/              # Configurações Supabase
│   └── public/                # Assets públicos
└── docs/                      # Documentação
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- pnpm
- PostgreSQL

### Instalação
```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:migrate
pnpm db:seed
```

### Desenvolvimento
```bash
# Backend API
pnpm dev:api

# Frontend Web
pnpm dev:web

# Mobile App
pnpm dev:mobile

# Database Studio
pnpm db:studio
```

### Build & Deploy
```bash
# Build todos os projetos
pnpm build

# Build específico
pnpm build:api
pnpm build:web

# TypeCheck
pnpm typecheck
```

## 🎯 Funcionalidades

### 🎲 Para Mestres
- Criar e gerenciar sessões de RPG
- Definir preços e horários
- Gerenciar reservas de jogadores
- Receber pagamentos via Asaas
- Contratos digitais via ZapSign

### 🎮 Para Jogadores
- Buscar e reservar sessões
- Fazer pagamentos seguros
- Chat com mestres e outros jogadores
- Sistema de avaliações
- Histórico de sessões

### 🏪 Para Lojistas
- Cadastrar espaços para sessões
- Gerenciar cardápio de comidas/bebidas
- Receber pedidos durante as sessões
- Dashboard de vendas e analytics

### 🛒 Marketplace
- Compra e venda de assets (mapas, tokens, módulos)
- Sistema de avaliações
- Downloads seguros
- Comissões automáticas

## 🛠 Stack Tecnológica

### Frontend Web
- **React 18** + TypeScript
- **Vite** para build
- **Tailwind CSS** para styling
- **React Router** para navegação

### Mobile
- **React Native** + Expo
- **TypeScript**
- **React Navigation**

### Backend
- **Fastify** + TypeScript
- **Prisma** ORM
- **PostgreSQL**
- **JWT** para autenticação

### Integrações
- **Asaas API** - Pagamentos
- **ZapSign API** - Contratos digitais
- **Google Maps API** - Localização
- **Google Calendar API** - Agendamento
- **Firebase** - Notificações push

## 📱 Apps

### Web App
- Interface responsiva para desktop e mobile
- PWA com suporte offline
- Notificações em tempo real

### Mobile App
- App nativo iOS/Android
- Push notifications
- Geolocalização
- Camera para upload de assets

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev:api          # Rodar API em modo dev
pnpm dev:web          # Rodar web app em modo dev
pnpm dev:mobile       # Rodar mobile app

# Build
pnpm build            # Build todos os projetos
pnpm build:api        # Build apenas API
pnpm build:web        # Build apenas web

# Database
pnpm db:generate      # Gerar Prisma client
pnpm db:migrate       # Rodar migrations
pnpm db:seed          # Popular banco com dados
pnpm db:studio        # Abrir Prisma Studio

# Qualidade
pnpm typecheck        # TypeScript check em todos
pnpm typecheck:api    # TypeScript check na API
pnpm typecheck:web    # TypeScript check no web
pnpm clean            # Limpar caches e builds
```

## 🔐 Autenticação (Auth0)

A API usa Auth0 para autenticação JWT. Configure as seguintes variáveis de ambiente:

### Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `AUTH0_DOMAIN` | Domínio do tenant Auth0 | `app-sociodotabuleiro.us.auth0.com` |
| `AUTH0_CLIENT_ID` | Client ID da aplicação SPA | `abc123...` |
| `AUTH0_CLIENT_SECRET` | Client Secret (apenas backend) | `xyz789...` |
| `AUTH0_ISSUER_BASE_URL` | URL base do issuer | `https://app-sociodotabuleiro.us.auth0.com/` |
| `AUTH0_AUDIENCE` | Audience da API | `https://api.sociodotabuleiro` |

### Configuração Auth0

1. **Criar API no Auth0:**
   - Identifier: `https://api.sociodotabuleiro`
   - Signing Algorithm: RS256
   - Enable RBAC: ✅
   - Add Permissions in Access Token: ✅

2. **Permissões da API:**
   - `sessions:read` - Ler sessões
   - `sessions:write` - Criar/editar sessões
   - `sessions:delete` - Deletar sessões
   - `bookings:read` - Ler reservas
   - `bookings:write` - Criar/editar reservas
   - `admin:all` - Acesso administrativo total

3. **Action Post Login (para roles):**
   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const roles = event.authorization?.roles || []
     api.accessToken.setCustomClaim('https://sociodotabuleiro.app/roles', roles)
   }
   ```

4. **Roles (criar em User Management > Roles):**
   - `PLAYER` - Jogador padrão
   - `MASTER` - Mestre de RPG
   - `VENUE` - Lojista/Espaço
   - `ADMIN` - Administrador

### Frontend (Vite)

```env
VITE_AUTH0_DOMAIN=app-sociodotabuleiro.us.auth0.com
VITE_AUTH0_CLIENT_ID=seu_client_id
VITE_AUTH0_AUDIENCE=https://api.sociodotabuleiro
```

### Backend (Node.js)

```env
AUTH0_ISSUER_BASE_URL=https://app-sociodotabuleiro.us.auth0.com/
AUTH0_AUDIENCE=https://api.sociodotabuleiro
```

## 🧪 Testes

```bash
# Rodar testes da API
cd apps/api && pnpm test

# Testes específicos
pnpm test -- auth.test.ts
```

## 🌟 Próximos Passos

- [x] Implementar autenticação completa (Auth0)
- [ ] Integrar APIs de pagamento
- [ ] Sistema de notificações
- [x] Testes automatizados (básicos)
- [ ] CI/CD pipeline
- [ ] Documentação da API