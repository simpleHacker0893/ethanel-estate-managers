# @ethanel/config

Shared tooling configuration. Consumed by every workspace package; owns no runtime code.

| Export                                   | Purpose                                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `eslint/base`                            | Flat config: typed TS rules, `boundaries` (import graph), money `bigint` rule.          |
| `eslint/next`                            | Base plus `@next/next`, `react-hooks`, `jsx-a11y` (strict).                             |
| `eslint/node`                            | Base for Fastify services, workers and library packages.                                |
| `tsconfig/{base,library,next,node}.json` | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.                     |
| `tailwind/preset.css`                    | Layout utilities (`container-x`, `section-y`, `grid-12`). Tokens live in `@ethanel/ui`. |

Rules encoded here, not in prose:

- **Boundaries**: apps, services and workers import `packages/*` only; nothing imports another app
  or service; `packages/contracts` imports nothing internal.
- **Money**: any file under `*/money/*` or named `*.money.ts` may not use `number`, `Number()`,
  `parseFloat`, `parseInt` or decimal literals. Amounts are `bigint` minor units (KES cents).
