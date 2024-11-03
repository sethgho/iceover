// routes/api/send-notifications.ts
import { EXPLICIT_PUSH_SECRET } from "../../utils/config.ts";
import { notifyUsers } from "../../utils/notify.ts";

export const handler = async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const authorization = req.headers.get("X-Push-Secret");
    if (authorization !== EXPLICIT_PUSH_SECRET) {
        console.error("Unauthorized request to explicitly push notifications");
        return new Response("Unauthorized", { status: 401 });
    }

    console.info("Sending notifications");
    await notifyUsers();
    return new Response("Notifications sent", { status: 200 });
};
