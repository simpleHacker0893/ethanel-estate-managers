import type { DemoRequest } from '@ethanel/contracts/demo-request';

import { leads } from '@/lib/leads';

/** Kept for the landing email form; delegates to the shared lead sink (P-14). */
export interface DemoRequestSink {
  save(request: DemoRequest & { receivedAt: string; ip: string }): Promise<void>;
}

export const demoRequests: DemoRequestSink = {
  save: ({ receivedAt, ip, ...payload }) =>
    leads.save({ type: 'demo_request', payload, receivedAt, ip }),
};
