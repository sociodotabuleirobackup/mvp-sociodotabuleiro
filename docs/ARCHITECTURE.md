# Arquitetura do Projeto

## 📁 Estrutura Organizada

O projeto foi refatorado para uma estrutura monorepo limpa e bem organizada:

```
socio-do-tabuleiro/
├── apps/                           # Aplicações
│   ├── api/                        # Backend API
│   │   ├── src/
│   │   │   ├── routes/             # Rotas da API
│   │   │   ├── plugins/            # Plugins Fastify
│   │   │   └── index.ts            # Entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                        # Frontend Web
│   │   ├── src/
│   │   │   ├── components/         # Componentes React
│   │   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── services/           # Serviços (APIs externas)
│   │   │   ├── assets/             # Assets estáticos
│   │   │   ├── App.tsx             # Componente principal
│   │   │   ├── main.tsx            # Entry point
│   │   │   └── store.tsx           # Context/Estado global
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── mobile/                     # Mobile App (React Native)
│       ├── src/
│       │   ├── contexts/           # Contexts React
│       │   ├── screens/            # Telas do app
│       │   └── components/         # Componentes reutilizáveis
│       ├── App.tsx
│       ├── app.json                # Configuração Expo
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                       # Packages compartilhados
│   ├── shared/                     # Código compartilhado
│   │   ├── src/
│   │   │   ├── types.ts            # Tipos TypeScript
│   │   │   ├── utils.ts            # Funções utilitárias
│   │   │   ├── constants.ts        # Constantes da aplicação
│   │   │   └── index.ts            # Exports principais
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── database/                   # Database schema e migrations
│       ├── prisma/
│       │   ├── schema.prisma       # Schema do banco
│       │   └── seed.ts             # Dados iniciais
│       ├── src/
│       │   └── index.ts            # Client Prisma
│       ├── package.json
│       └── tsconfig.json
│
├── tools/                          # Ferramentas e scripts
│   ├── scripts/                    # Scripts de automação
│   ├── supabase/                   # Configurações Supabase
│   └── public/                     # Assets públicos
│
├── docs/                           # Documentação
│   └── ARCHITECTURE.md             # Este arquivo
│
├── package.json                    # Workspace root
├── pnpm-workspace.yaml             # Configuração workspace
└── README.md                       # Documentação principal
```

## 🎯 Benefícios da Nova Estrutura

### 1. **Separação Clara de Responsabilidades**
- **apps/**: Aplicações executáveis (API, Web, Mobile)
- **packages/**: Código compartilhado entre aplicações
- **tools/**: Scripts e ferramentas de desenvolvimento

### 2. **Reutilização de Código**
- **@socio-do-tabuleiro/shared**: Tipos, utils e constantes compartilhadas
- **@socio-do-tabuleiro/database**: Schema e client do banco compartilhado

### 3. **Desenvolvimento Independente**
- Cada app pode ser desenvolvido, testado e deployado independentemente
- Dependencies isoladas por aplicação
- TypeScript configurado adequadamente para cada contexto

### 4. **Escalabilidade**
- Fácil adição de novos apps (admin, dashboard, etc.)
- Packages podem ser extraídos para NPM se necessário
- Estrutura preparada para microserviços

## 🔧 Scripts de Desenvolvimento

### Comandos Globais (na raiz)
```bash
# Desenvolvimento
pnpm dev:api          # Rodar API
pnpm dev:web          # Rodar web app
pnpm dev:mobile       # Rodar mobile app

# Build
pnpm build            # Build todos
pnpm build:api        # Build API
pnpm build:web        # Build web

# Qualidade
pnpm typecheck        # TypeCheck todos
pnpm typecheck:web    # TypeCheck web
pnpm typecheck:api    # TypeCheck API

# Database
pnpm db:generate      # Gerar Prisma client
pnpm db:migrate       # Rodar migrations
pnpm db:seed          # Popular dados
pnpm db:studio        # Abrir Prisma Studio
```

### Comandos Específicos por App
```bash
# Web App
cd apps/web
pnpm dev              # Desenvolvimento
pnpm build            # Build para produção
pnpm typecheck        # Verificar tipos

# API
cd apps/api
pnpm dev              # Desenvolvimento
pnpm build            # Build para produção
pnpm start            # Rodar produção

# Mobile
cd apps/mobile
pnpm start            # Expo dev server
pnpm android          # Rodar no Android
pnpm ios              # Rodar no iOS
```

## 📦 Packages Compartilhados

### @socio-do-tabuleiro/shared
Contém todo código compartilhado entre as aplicações:

- **types.ts**: Interfaces e enums TypeScript
- **utils.ts**: Funções utilitárias (formatação, validação)
- **constants.ts**: Constantes da aplicação (cores, endpoints, etc.)

### @socio-do-tabuleiro/database
Gerencia todo acesso ao banco de dados:

- **schema.prisma**: Definição das tabelas
- **migrations/**: Histórico de mudanças no banco
- **seed.ts**: Dados iniciais para desenvolvimento

## 🚀 Deploy Strategy

### Frontend Web
- Build estático com Vite
- Deploy em Vercel/Netlify
- PWA com service worker

### Backend API
- Build com TypeScript
- Deploy em Railway/Render
- Docker container

### Mobile App
- Build com Expo EAS
- Deploy nas stores (iOS/Android)
- OTA updates com Expo

## 🔄 Workflow de Desenvolvimento

1. **Mudanças no Shared**: Afetar todos os apps
2. **Mudanças no Database**: Rodar migrations em todos ambientes
3. **Mudanças nos Apps**: Deploy independente
4. **TypeCheck**: Sempre antes de commit
5. **Build**: Testar build antes de deploy

## 📋 Próximos Passos

- [ ] Configurar CI/CD para cada app
- [ ] Adicionar testes automatizados
- [ ] Configurar Docker para desenvolvimento
- [ ] Documentar APIs com OpenAPI
- [ ] Configurar monitoramento e logs