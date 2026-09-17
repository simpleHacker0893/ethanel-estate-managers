import { NotImplementedError } from './ids';

/** Kubernetes probes: /healthz (liveness), /readyz (readiness incl. DB ping), /startupz. */
export interface ProbeState {
  ready: boolean;
  markReady(): void;
  markNotReady(reason: string): void;
}

export function createProbes(): ProbeState {
  throw new NotImplementedError('chassis/probes.createProbes');
}
