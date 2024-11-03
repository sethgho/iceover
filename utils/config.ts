const env = Deno.env.toObject();

export const VAPID_PUBLIC_KEY = env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = env.VAPID_PRIVATE_KEY;
export const CONTACT_EMAIL = env.CONTACT_EMAIL;
export const ICETIME_ALERTS_BASE_URL = env.ICETIME_ALERTS_BASE_URL ||
    "iceover-ice-rink-reminders.deno.dev";
