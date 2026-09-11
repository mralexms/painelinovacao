FROM node:22-slim

RUN npm install -g pnpm@11.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["node", "scripts/run-framework.mjs", "dev", "--host", "0.0.0.0"]
