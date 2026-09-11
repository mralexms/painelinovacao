# Mapa de Competências IFMA

Dashboard por campus para apoiar o Eixo 1 — Capacidades Institucionais da Política de Inovação do IFMA.

## O que o sistema apresenta

- cursos publicados nos sites oficiais dos campi do IFMA;
- pesquisadores identificados nas produções do Portal Integra;
- ranking dos 10 pesquisadores com maior quantidade de registros na amostra;
- totais de produções bibliográficas e técnicas;
- grandes áreas, áreas e competências inferidas dos títulos das publicações;
- laboratórios cadastrados no Integra;
- filtros por campus e pesquisa por nome, área ou competência.

## Fontes

- [Portal Integra — Produções](https://integra.ifma.edu.br/tecnologias/producoes)
- [Portal IFMA — Cursos ofertados](https://portal.ifma.edu.br/cursosofertados/)

Os dados de produção e laboratórios são consultados no navegador diretamente na API pública do Integra. O catálogo de cursos fica em `app/data/courses.json` e pode ser atualizado pelo coletor `scripts/sync-courses.mjs`.

> As áreas e competências são inferências temáticas baseadas nos títulos das publicações. Elas não substituem uma classificação institucional ou a validação dos pesquisadores.

## Tecnologias

- React e TypeScript
- Vinext/Next.js App Router
- Tailwind CSS
- componentes Shadcn UI
- Recharts
- Cloudflare Workers / OpenAI Sites

## Requisitos

- Node.js 22.13 ou superior
- pnpm 11 ou superior

## Executar localmente

```bash
pnpm install
pnpm dev
```

Depois, abra `http://localhost:5173`.

## Gerar a versão de produção

```bash
pnpm build
pnpm start
```

## Atualizar o catálogo oficial de cursos

```bash
node scripts/sync-courses.mjs
```

O coletor percorre as páginas oficiais relacionadas em cada campus, remove links administrativos e grava o resultado em `app/data/courses.json`. Alguns campi não mantêm uma lista de cursos em formato estruturado; nesses casos o dashboard apresenta um estado vazio, sem criar registros artificiais.

## Estrutura principal

```text
app/
  api/dashboard/route.ts   rota alternativa de agregação
  data/courses.json        catálogo extraído dos sites oficiais
  globals.css              tema e layout responsivo
  layout.tsx               metadados da aplicação
  page.tsx                 dashboard e integração com o Integra
components/ui/             componentes de interface
public/                    ícones e arquivos públicos
scripts/sync-courses.mjs   sincronização dos cursos
.openai/hosting.json       configuração do OpenAI Sites
```

## Publicação em outro serviço

O projeto pode ser importado em um repositório GitHub ou GitLab. Em plataformas compatíveis com Node.js, use:

- comando de instalação: `pnpm install --frozen-lockfile`
- comando de build: `pnpm build`
- versão do Node.js: 22 ou superior

O arquivo `.gitignore` já exclui dependências, builds locais, caches, arquivos de ambiente e credenciais.
