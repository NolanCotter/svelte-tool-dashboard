import { building, dev } from '$app/environment';
import { getRequestEvent } from '$app/server';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { jwt } from 'better-auth/plugins';

function nonEmpty(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveAuthSecret() {
  const configuredSecret = nonEmpty(privateEnv.BETTER_AUTH_SECRET);

  if (configuredSecret) {
    return configuredSecret;
  }

  if (dev || building) {
    return 'brace-face-ai-dev-secret';
  }

  throw new Error('Missing BETTER_AUTH_SECRET. Set BETTER_AUTH_SECRET before starting the app.');
}

const siteUrl =
  nonEmpty(publicEnv.PUBLIC_SITE_URL) ?? nonEmpty(privateEnv.SITE_URL) ?? 'http://localhost:5173';

const trustedOrigins = [siteUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(
  (origin): origin is string => Boolean(origin)
);

export const auth = betterAuth({
  secret: resolveAuthSecret(),
  trustedOrigins,
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    jwt({
      jwt: {
        issuer: siteUrl,
        audience: siteUrl,
        expirationTime: '8h',
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role ?? 'admin'
        })
      }
    }),
    sveltekitCookies(getRequestEvent)
  ]
});
