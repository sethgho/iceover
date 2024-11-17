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
if (CONTACT_EMAIL) {
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
        const { shouldNotify, eventStartTimesByProgramId } = checkResults(
            entry.value.programIds,
            events,
        );

        if (shouldNotify) {
            console.info("Sending notification", {
                subscription: entry.value,
                eventStartTimesByProgramId,
            });
            const notificationData = createNotification(
                eventStartTimesByProgramId,
            );
            await sendPushNotification(entry.value, notificationData);
        }
    }
}

function createNotification(
    eventStartTimesByProgramId: Record<number, string[]>,
): IceTimeNotification {
    let body = Object.keys(eventStartTimesByProgramId)
        .map((programId) => {
            return getProgramMessage(
                Number(programId),
                eventStartTimesByProgramId[Number(programId)],
            );
        })
        .join("\n");
    if (!body.length) {
        body = "Click to see tomorrow's ice time.";
    }

    const url = new URL(ICETIME_ALERTS_BASE_URL);
    Object.keys(eventStartTimesByProgramId).forEach((programId) => {
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

function getProgramMessage(programId: number, eventStartTimes: string[]) {
    let timesLabel = "times";
    if (eventStartTimes.length > 3) {
        timesLabel = `${eventStartTimes.length} time slots`;
    } else {
        timesLabel = eventStartTimes
            .map((time) => {
                const [hours, minutes] = time.split(":");
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? "pm" : "am";
                const hour12 = hour % 12 || 12;
                return minutes === "00"
                    ? `${hour12}${ampm}`
                    : `${hour12}:${minutes}${ampm}`;
            })
            .join(", ");
    }

    return `${getProgramLabel(programId)}: ${timesLabel}`;
}

function checkResults(
    programIds: number[],
    events: IceEvent[],
): {
    shouldNotify: boolean;
    eventStartTimesByProgramId: Record<number, string[]>;
} {
    const eventStartTimesByProgramId: Record<number, string[]> = {};
    for (const event of events) {
        if (programIds.includes(event.programId)) {
            if (eventStartTimesByProgramId[event.programId]) {
                eventStartTimesByProgramId[event.programId].push(
                    event.eventStartTime,
                );
            } else {
                eventStartTimesByProgramId[event.programId] = [
                    event.eventStartTime,
                ];
            }
        }
    }
    return {
        shouldNotify: Object.values(eventStartTimesByProgramId).some((times) =>
            times.length > 0
        ),
        eventStartTimesByProgramId,
    };
}
