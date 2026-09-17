import { NotImplementedError } from './ids';

/** pg-boss queue in each service's own schema; transactional outbox drains into it. */
export interface JobQueue {
  send(
    name: string,
    data: Record<string, unknown>,
    opts?: { retryLimit?: number },
  ): Promise<string>;
  work(name: string, handler: (data: Record<string, unknown>) => Promise<void>): Promise<void>;
  stop(): Promise<void>;
}

export function createJobQueue(_opts: { schema: string; connectionString: string }): JobQueue {
  throw new NotImplementedError('chassis/jobs.createJobQueue');
}
