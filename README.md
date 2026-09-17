# Ethanel

Property management and a marketplace for Kenya's letting firms, land-selling companies,
landlords, caretakers, residents and buyers. One repository for the marketing site, the
marketplace, the multi-tenant dashboard, the WhatsApp-first surfaces, the public gateway and the
backend services.

## Start here

- `.docs/AGENTS.md` — vocabulary and house rules
- `.docs/ARCHITECTURE.md` — topology, boundaries, tenancy, money, caching
- `.docs/sprints/001/` — what this sprint built and what comes next

## Develop

```bash
nvm use            # Node 22 from .nvmrc
corepack enable    # pnpm 10 from package.json#packageManager
pnpm install
pnpm turbo run lint typecheck build
pnpm --filter web dev
```

## Layout

```
apps/web        Next.js 16 App Router (BFF, Server Actions only)
apps/gateway    Fastify: public /v1 REST, API keys, all inbound webhooks (placeholder)
services/*      nine Fastify domain services on packages/chassis (placeholders)
workers/*       four pg-boss workers (placeholders)
packages/*      contracts · chassis · ui · config · db · testing
charts/service  Helm library chart every Deployment inherits
infra/*         OpenTofu modules
.docs/          Operating Pack
```
