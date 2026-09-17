/**
 * Error envelope returned by every service and the gateway.
 * `code` is stable and machine-readable; `message` is safe to show; `details` is validation-only.
 */
export interface ErrorEnvelope {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: readonly { path: string; message: string }[];
    readonly traceId?: string;
  };
}

export class AppError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly details?: readonly { path: string; message: string }[],
  ) {
    super(message);
    this.name = 'AppError';
  }

  toEnvelope(traceId?: string): ErrorEnvelope {
    const base: ErrorEnvelope['error'] = { code: this.code, message: this.message };
    return {
      error: {
        ...base,
        ...(this.details ? { details: this.details } : {}),
        ...(traceId ? { traceId } : {}),
      },
    };
  }
}
