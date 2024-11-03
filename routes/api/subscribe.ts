// routes/api/subscribe.ts
import { Handler, RouteContext } from "$fresh/server.ts";
import webpush from "npm:web-push@3.6.7"; // Update if available
import {
    CONTACT_EMAIL,
    VAPID_PRIVATE_KEY,
    VAPID_PUBLIC_KEY,
} from "../../utils/config.ts";
import {
    addSubscription,
    IceTimeSubscription,
    IceTimeSubscriptionSchema,
} from "../../storage/subscription.ts";

webpush.setVapidDetails(
    CONTACT_EMAIL,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
);

export const handler: Handler = async (req: Request, _ctx: RouteContext) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }
    let subscription: IceTimeSubscription;
    try {
        subscription = IceTimeSubscriptionSchema.parse(
            await req.json(),
        );
        console.log(subscription);
    } catch {
        return new Response("Invalid subscription payload", { status: 400 });
    }

    await addSubscription(subscription);

    return new Response("Subscribed", { status: 201 });
};
