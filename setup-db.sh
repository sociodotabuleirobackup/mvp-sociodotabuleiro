#!/bin/bash

echo "🚀 Configurando banco de dados..."

# 1. Copiar .env.example para .env no pacote db
if [ ! -f packages/db/.env ]; then
  echo "📝 Criando packages/db/.env..."
  cp packages/db/.env.example packages/db/.env
  echo "⚠️  Configure as variáveis DATABASE_URL e DIRECT_URL em packages/db/.env"
fi

# 2. Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# 3. Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
pnpm db:generate

# 4. Executar migrations
echo "🗄️  Executando migrations..."
pnpm db:migrate

# 5. Executar seed
echo "🌱 Populando banco com dados iniciais..."
pnpm db:seed

echo "✅ Configuração concluída!"
echo ""
echo "📌 Próximos passos:"
echo "   1. Configure suas credenciais do Supabase em .env.local"
echo "   2. Execute: pnpm dev"
