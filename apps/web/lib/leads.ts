import type { ContactRequest } from '@ethanel/contracts/contact-request';
import type { DemoQuestionnaire } from '@ethanel/contracts/demo-questionnaire';
import type { DemoRequest } from '@ethanel/contracts/demo-request';

import { serverEnv } from '@/lib/env';

/**
 * Where every lead goes (demo email, contact form, questionnaire). Sprint 002: a structured log
 * line plus, when DEMO_WEBHOOK_URL is set, a JSON POST. The gateway → billing-svc call replaces
 * this sink without touching the Server Actions.
 */
export type LeadEnvelope = { receivedAt: string; ip: string } & (
  | { type: 'demo_request'; payload: DemoRequest }
  | { type: 'contact_request'; payload: ContactRequest }
  | { type: 'demo_questionnaire'; payload: DemoQuestionnaire }
);

export interface LeadSink {
  save(lead: LeadEnvelope): Promise<void>;
}

function summary(lead: LeadEnvelope): Record<string, unknown> {
  // Never the raw email or phone in a log line.
  switch (lead.type) {
    case 'demo_request':
      return { source: lead.payload.source, emailDomain: lead.payload.email.split('@')[1] ?? '' };
    case 'contact_request':
      return { interest: lead.payload.interest, units: lead.payload.units };
    case 'demo_questionnaire':
      return {
        organizationType: lead.payload.organizationType,
        portfolioSize: lead.payload.portfolioSize,
        counties: lead.payload.counties,
        timeline: lead.payload.timeline,
        emailDomain: lead.payload.contact.email.split('@')[1] ?? '',
      };
  }
}

class LogAndWebhookSink implements LeadSink {
  async save(lead: LeadEnvelope): Promise<void> {
    const { DEMO_WEBHOOK_URL } = serverEnv();
    console.warn(
      JSON.stringify({
        level: 'info',
        event: lead.type,
        receivedAt: lead.receivedAt,
        ...summary(lead),
      }),
    );
    if (!DEMO_WEBHOOK_URL) return;
    const response = await fetch(DEMO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: lead.type, receivedAt: lead.receivedAt, ...lead.payload }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`lead webhook responded ${response.status}`);
  }
}

export const leads: LeadSink = new LogAndWebhookSink();
