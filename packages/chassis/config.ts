import { NotImplementedError } from './ids';

/** Every service declares its env with a zod schema and reads it once at boot. */
export interface ServiceConfig {
  readonly serviceName: string;
  readonly nodeEnv: 'development' | 'test' | 'production';
  readonly port: number;
  readonly databaseUrl: string;
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export function loadConfig(_serviceName: string): ServiceConfig {
  throw new NotImplementedError('chassis/config.loadConfig');
}
