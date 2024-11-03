import webPush from "https://esm.sh/web-push@3.5.0";
import {
    CONTACT_EMAIL,
    VAPID_PRIVATE_KEY,
    VAPID_PUBLIC_KEY,
} from "./config.ts";
import {
    deleteSubscription,
    getAllSubscriptions,
} from "../storage/subscription.ts";
import { IceTimeSubscription } from "../storage/subscription.ts";
import {
    getProgramLabel,
    getTomorrowEvents,
    IceEvent,
} from "../icehouseApi.ts";
import { ICETIME_ALERTS_BASE_URL } from "./config.ts";

// Something funky happens during the build process with deno deploy.
// https://github.com/denoland/fresh/issues/1843
if (VAPID_PRIVATE_KEY) {
    // Configure web-push
    webPush.setVapidDetails(
        CONTACT_EMAIL,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY,
    );
}

type IceTimeNotification = {
    type: "alert";
    title: string;
    body: string;
    icon: string;
    url: string;
};

export async function sendPushNotification(
    iceTimeSubscription: IceTimeSubscription,
    data: IceTimeNotification,
) {
    try {
        await webPush.sendNotification(
            iceTimeSubscription.subscription,
            JSON.stringify(data),
        );
        // deno-lint-ignore no-explicit-any
    } catch (error: any) {
        console.error("Error sending notification:", error);
        // Remove the subscription if it's no longer valid
        if (error.statusCode === 410 || error.statusCode === 404) {
            deleteSubscription(iceTimeSubscription);
        }
    }
}

export async function notifyUsers() {
    const events = await getTomorrowEvents();
    const subscriptions = getAllSubscriptions();

    for await (const entry of subscriptions) {
        const { shouldNotify, eventsByProgramId } = checkResults(
            entry.value.programIds,
            events,
        );

        if (shouldNotify) {
            const notificationData = createNotification(eventsByProgramId);
            console.log("Sending notification", { notificationData });
            await sendPushNotification(entry.value, notificationData);
        }
    }
}

function createNotification(
    eventsByProgramId: Record<number, number>,
): IceTimeNotification {
    let body = Object.keys(eventsByProgramId)
        .map((programId) => {
            return `${getProgramLabel(Number(programId))}: ${
                eventsByProgramId[Number(programId)]
            }`;
        })
        .join("\n");
    if (!body.length) {
        body = "Click to see tomorrow's ice time.";
    }

    const url = new URL(ICETIME_ALERTS_BASE_URL);
    Object.keys(eventsByProgramId).forEach((programId) => {
        url.searchParams.append(
            "program",
            programId,
        );
    });

    return {
        title: "Ice Time Update",
        type: "alert",
        body,
        icon: "/icon.png",
        url: url.toString(),
    };
}

function checkResults(
    programIds: number[],
    events: IceEvent[],
): { shouldNotify: boolean; eventsByProgramId: Record<number, number> } {
    const eventCounts: Record<number, number> = {};
    for (const event of events) {
        if (programIds.includes(event.programId)) {
            if (eventCounts[event.programId]) {
                eventCounts[event.programId]++;
            } else {
                eventCounts[event.programId] = 1;
            }
        }
    }
    return {
        shouldNotify: Object.values(eventCounts).some((count) => count > 0),
        eventsByProgramId: eventCounts,
    };
}
