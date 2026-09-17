import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk session handling for every request (Next 16 `proxy.ts`, never `middleware.ts`).
 *
 * Signed-out visitors to the dashboard, the landlord portal or the resident surface are
 * redirected to /sign-in here for a fast optimistic redirect. This is *not* the authorization
 * layer: whether a signed-in person may see a given organization, landlord or lease is decided
 * in `lib/auth.ts` against the database (memberships, landlord and lease rows under RLS), and
 * every protected page and layout calls that guard itself.
 */
const PROTECTED_PATH = /^\/(org|landlord|me|after-sign-in)(\/|$)/;

/**
 * Next inlines `process.env.NAME` member reads into the proxy bundle at build time, so Clerk's
 * own `CLERK_JWT_KEY` default is frozen to whatever the build machine had (nothing, in CI and
 * in the Docker build). A computed read stays a runtime read. `CLERK_SECRET_KEY` is read at
 * runtime by Clerk itself and must not be passed here (that path needs CLERK_ENCRYPTION_KEY).
 */
function runtimeEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : undefined;
}

const jwtKey = runtimeEnv('CLERK_JWT_KEY');

export default clerkMiddleware(
  async (auth, request) => {
    if (PROTECTED_PATH.test(request.nextUrl.pathname)) {
      await auth.protect();
    }
  },
  {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    ...(jwtKey ? { jwtKey } : {}),
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
