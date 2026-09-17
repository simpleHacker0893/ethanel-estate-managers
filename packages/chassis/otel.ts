import { NotImplementedError } from './ids';

/** OpenTelemetry SDK bootstrap. Traces + metrics over OTLP; Prisma and Fastify instrumented. */
export interface Telemetry {
  shutdown(): Promise<void>;
}

export function startTelemetry(_opts: { serviceName: string }): Telemetry {
  throw new NotImplementedError('chassis/otel.startTelemetry');
}
