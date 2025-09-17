# backend/Dockerfile
FROM python:3.11-slim

# Evita .pyc y activa logs flush
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    APP_HOME=/app

WORKDIR ${APP_HOME}

# Si usas psycopg2 (compilación), descomenta lo de abajo:
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential gcc libpq-dev && \
#     rm -rf /var/lib/apt/lists/*

# Requisitos primero para aprovechar cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos código y entrypoint
COPY app ./app
COPY entrypoint.sh /entrypoint.sh

# Carpeta de uploads
RUN mkdir -p ${APP_HOME}/uploads && \
    chmod +x /entrypoint.sh && \
    adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser ${APP_HOME} /entrypoint.sh

USER appuser

EXPOSE ${PORT}
CMD ["/entrypoint.sh"]
