#!/bin/bash

# Database Setup Script
# Este script facilita o setup inicial do banco de dados

set -e

echo "🗄️  Database Setup Script"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env created. Please update DATABASE_URL if needed.${NC}"
    echo ""
fi

# Function to run commands
run_command() {
    echo -e "${YELLOW}▶ $1${NC}"
    eval $2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Done${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
        exit 1
    fi
    echo ""
}

# Menu
echo "What would you like to do?"
echo ""
echo "1) Full setup (generate + migrate + seed)"
echo "2) Generate Prisma Client only"
echo "3) Run migrations only"
echo "4) Run seed only"
echo "5) Reset database (⚠️  WARNING: deletes all data)"
echo "6) Open Prisma Studio"
echo "7) Exit"
echo ""
read -p "Enter your choice [1-7]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Running full setup..."
        echo ""
        run_command "Generating Prisma Client..." "pnpm db:generate"
        run_command "Running migrations..." "pnpm db:migrate"
        run_command "Seeding database..." "pnpm db:seed"
        echo -e "${GREEN}🎉 Database setup complete!${NC}"
        ;;
    2)
        echo ""
        run_command "Generating Prisma Client..." "pnpm db:generate"
        ;;
    3)
        echo ""
        run_command "Running migrations..." "pnpm db:migrate"
        ;;
    4)
        echo ""
        run_command "Seeding database..." "pnpm db:seed"
        ;;
    5)
        echo ""
        echo -e "${RED}⚠️  WARNING: This will delete ALL data in the database!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            run_command "Resetting database..." "pnpm db:reset"
            echo -e "${GREEN}✅ Database reset complete!${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    6)
        echo ""
        echo "Opening Prisma Studio..."
        echo "Access at: http://localhost:5555"
        pnpm db:studio
        ;;
    7)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac