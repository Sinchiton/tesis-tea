#!/usr/bin/env bash
set -e

# Migraciones (si usas Alembic, coméntalo si no aplica)
# alembic upgrade head || true

# Crear uploads si no existe
mkdir -p /app/uploads

# Arrancar Uvicorn
# En dev puedes añadir --reload
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
