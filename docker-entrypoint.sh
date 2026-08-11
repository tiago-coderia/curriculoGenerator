#!/bin/sh
set -e

echo "Sincronizando esquema Prisma com o banco SQLite..."
npx prisma db push

if [ "$SEED_ON_START" = "true" ]; then
  echo "Executando seed do banco de dados..."
  npm run db:seed || true
fi

exec "$@"
