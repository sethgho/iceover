export const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
export const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
export const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL");
export const ICETIME_ALERTS_BASE_URL =
    Deno.env.get("ICETIME_ALERTS_BASE_URL") ||
    "iceover-ice-rink-reminders.deno.dev";
