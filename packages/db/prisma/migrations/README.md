# Migrations

Forward-only SQL, one folder per migration, applied with `prisma migrate deploy` against the
**direct** (non-pooled) connection string (`DATABASE_URL_UNPOOLED`). Each migration that adds a
tenant table must also enable and force row-level security on it and add the read/write policies
in the shape used by `20260917090000_init`.

Generate the next migration from a schema change without a database:

```
pnpm --filter @ethanel/db exec prisma migrate diff \
  --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script \
  --shadow-database-url "$DATABASE_URL_UNPOOLED"
```

then append the RLS statements by hand and review the whole file before committing.
