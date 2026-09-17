/**
 * OpenTelemetry stub. @ethanel/chassis/otel replaces this in Sprint 002 with the real SDK
 * (OTLP exporter, Fastify/Prisma instrumentations). Kept here so the file convention and the
 * Node-only guard are already in place.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Sprint 002: await import('@ethanel/chassis/otel').then((m) => m.startTelemetry({ serviceName: 'web' }))
    await Promise.resolve();
  }
}
