import { NotImplementedError } from './ids';

/** Structured JSON logs (pino). Every line carries service, organization_id when known, trace_id. */
export interface Logger {
  debug(obj: Record<string, unknown>, msg?: string): void;
  info(obj: Record<string, unknown>, msg?: string): void;
  warn(obj: Record<string, unknown>, msg?: string): void;
  error(obj: Record<string, unknown>, msg?: string): void;
  child(bindings: Record<string, unknown>): Logger;
}

export function createLogger(_bindings: { service: string }): Logger {
  throw new NotImplementedError('chassis/logger.createLogger');
}
