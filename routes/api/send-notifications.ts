// routes/api/send-notifications.ts
import { notifyUsers } from "../../utils/notify.ts";

export const handler = async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // TODO: Implement authentication here to secure the endpoint

    await notifyUsers();
    return new Response("Notifications sent", { status: 200 });
};
