import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import kv from "./kv.ts";

export const IceTimeSubscriptionSchema = z.object({
    subscription: z.object({
        endpoint: z.string().url(),
        expirationTime: z.number().optional().nullable(),
        keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
        }),
    }),
    programIds: z.array(z.number()),
});
export type IceTimeSubscription = z.infer<typeof IceTimeSubscriptionSchema>;

export async function addSubscription(sub: IceTimeSubscription) {
    await kv.set(["subscription", sub.subscription.endpoint], sub);
}

export function getAllSubscriptions() {
    return kv.list<IceTimeSubscription>({
        prefix: ["subscription"],
    });
}

export async function deleteSubscription(sub: IceTimeSubscription) {
    await kv.delete(["subscription", sub.subscription.endpoint]);
}
