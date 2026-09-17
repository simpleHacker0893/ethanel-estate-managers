import type { DemoRequest } from '@ethanel/contracts/demo-request';

import { serverEnv } from '@/lib/env';

/**
 * Where a demo request goes. Sprint 001: a structured log line plus, when DEMO_WEBHOOK_URL is
 * set, a JSON POST (Slack, Make, a WhatsApp relay). The gateway → billing-svc call replaces this
 * sink without touching the Server Action.
 */
export interface DemoRequestSink {
  save(request: DemoRequest & { receivedAt: string; ip: string }): Promise<void>;
}

class LogAndWebhookSink implements DemoRequestSink {
  async save(request: DemoRequest & { receivedAt: string; ip: string }): Promise<void> {
    const { DEMO_WEBHOOK_URL } = serverEnv();
    // Structured log; never the raw email in a message string.
    console.warn(
      JSON.stringify({
        level: 'info',
        event: 'demo_request',
        source: request.source,
        emailDomain: request.email.split('@')[1] ?? '',
        receivedAt: request.receivedAt,
      }),
    );

    if (!DEMO_WEBHOOK_URL) return;
    const response = await fetch(DEMO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'demo_request',
        email: request.email,
        source: request.source,
        receivedAt: request.receivedAt,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(`demo webhook responded ${response.status}`);
    }
  }
}

export const demoRequests: DemoRequestSink = new LogAndWebhookSink();
