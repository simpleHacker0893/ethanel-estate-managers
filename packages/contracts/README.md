# @ethanel/contracts

zod schemas that are simultaneously the request shape, the OpenAPI entry and the React Hook Form
validator. Every Server Action, Fastify route and form imports its schema from here.

- `marketplace-search` — nuqs parsers + zod schema for `/marketplace?intent&where&type&budget&sort…`
- `demo-request` — `{ email }` for the landing demo form

Rules: imports nothing internal (enforced by ESLint boundaries); no React; built to `dist/` so
services and the gateway consume compiled JS with types.
