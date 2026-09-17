# syntax=docker/dockerfile:1.7
# Multi-stage build for apps/web. Context is the repository root:
#   docker build -f apps/web/Dockerfile --build-arg GIT_SHA=$(git rev-parse HEAD) -t ethanel/web .
# Node major pinned from .nvmrc (22). Bump both together.
ARG NODE_VERSION=22

# ---- deps: full workspace install, pruned to web -------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY packages/contracts/package.json packages/contracts/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter web... --ignore-scripts

# ---- build ------------------------------------------------------------------------------------
FROM deps AS build
ARG GIT_SHA=unknown
ENV NEXT_TELEMETRY_DISABLED=1 GIT_SHA=${GIT_SHA} NODE_ENV=production
COPY packages/config packages/config
COPY packages/ui packages/ui
COPY packages/contracts packages/contracts
COPY apps/web apps/web
RUN pnpm --filter @ethanel/contracts build \
 && pnpm --filter web build

# ---- runtime: standalone output, non-root, read-only root FS ----------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
ARG GIT_SHA=unknown
ENV GIT_SHA=${GIT_SHA}
RUN groupadd --gid 10001 app && useradd --uid 10001 --gid app --shell /usr/sbin/nologin --create-home app \
 && apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Standalone output carries its own pruned node_modules and server.js at apps/web/.
COPY --from=build --chown=app:app /repo/apps/web/.next/standalone ./
COPY --from=build --chown=app:app /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=app:app /repo/apps/web/public ./apps/web/public
# Next writes its image cache and temp files under .next/cache; point that at /tmp (the only
# writable path under readOnlyRootFilesystem) via a symlink.
RUN mkdir -p /tmp/next-cache && ln -s /tmp/next-cache ./apps/web/.next/cache && chown -h app:app ./apps/web/.next/cache
USER app
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "apps/web/server.js"]
