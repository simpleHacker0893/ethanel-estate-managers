import { NotImplementedError } from './ids';

/** SIGTERM → stop accepting, drain in-flight (max 25s under a 30s grace), close DB, exit 0. */
export function onShutdown(_hook: () => Promise<void>): void {
  throw new NotImplementedError('chassis/shutdown.onShutdown');
}
