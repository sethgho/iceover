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
    deleteSubscription,
    IceTimeSubscription,
    IceTimeSubscriptionSchema,
} from "../../storage/subscription.ts";

if (CONTACT_EMAIL) {
    webpush.setVapidDetails(
        CONTACT_EMAIL,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY,
    );
}

export const handler: Handler = async (req: Request, _ctx: RouteContext) => {
    let subscription: IceTimeSubscription;
    const json = await req.json();
    try {
        subscription = IceTimeSubscriptionSchema.parse(
            json,
        );
        console.log(subscription);
    } catch (error) {
        console.error("Invalid subscription payload", { error, json });
        return new Response("Invalid subscription payload", { status: 400 });
    }

    if (req.method === "POST") {
        await addSubscription(subscription);
        console.info("Added subscription", subscription);
        return new Response("Subscribed", { status: 201 });
    } else if (req.method === "DELETE") {
        await deleteSubscription(subscription);
        console.info("Deleted subscription", subscription);
        return new Response("Unsubscribed", { status: 200 });
    } else {
        return new Response("Method Not Allowed", { status: 405 });
    }
};
