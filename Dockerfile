FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Tailwind CLI standalone (sem Node/npm)
RUN ARCH="$(uname -m)" \
    && case "$ARCH" in \
         x86_64) TW_ARCH=x64 ;; \
         aarch64) TW_ARCH=arm64 ;; \
         *) echo "Arquitetura não suportada para o Tailwind CLI: $ARCH" >&2; exit 1 ;; \
       esac \
    && curl -sL -o /usr/local/bin/tailwindcss \
         "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-${TW_ARCH}" \
    && chmod +x /usr/local/bin/tailwindcss

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Compila o CSS do Tailwind já no build da imagem, para não depender
# do bind mount de desenvolvimento (usado apenas em docker-compose.override.yml).
RUN tailwindcss -i ./static_src/input.css -o ./static/css/tailwind.css --minify
