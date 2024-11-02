// storage.ts
import { DenoKV } from "https://deno.land/x/deno_kv@v0.1.0/mod.ts";

const kv = new DenoKV();

export const addSubscription = async (subscription: any) => {
  await kv.set(`subscription:${subscription.endpoint}`, subscription);
};

export const getSubscriptions = async () => {
  const entries = await kv.list("subscription:");
  return entries.values.map((v) => v.value);
};
