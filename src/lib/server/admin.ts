import { env } from '$env/dynamic/private';

function optional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const ADMIN_EMAIL = optional(env.ADMIN_EMAIL);
export const ADMIN_INITIAL_PASSWORD = optional(env.ADMIN_INITIAL_PASSWORD);
export const ADMIN_SESSION_TOKEN = optional(env.ADMIN_SESSION_TOKEN);
