import { useEffect, useState } from "preact/hooks";
import { BellAlertIcon, BellIcon } from "../components/Icons.tsx";

type NotifyProps = {
    programIds: number[];
    vapidPublicKey: string;
};

export default function NotifyButton(
    { programIds, vapidPublicKey }: NotifyProps,
) {
    const [subscribed, setSubscribed] = useState<boolean | null>(null);
    useEffect(() => {
        const checkSubscription = async () => {
            if (!("serviceWorker" in navigator)) {
                return;
            }

            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager
                    .getSubscription();
                setSubscribed(!!subscription);
            } catch (error) {
                console.error("Error checking subscription status:", error);
            }
        };

        checkSubscription();
    }, []);

    const unsubscribeUser = async () => {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager
                .getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
                await fetch("/api/subscribe", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subscription,
                        programIds,
                    }),
                });
                setSubscribed(false);
                console.info("Unsubscribed successfully");
            }
        } catch (error) {
            console.error("Error unsubscribing:", error);
            alert("Failed to unsubscribe from notifications");
        }
    };
    const subscribeUser = async () => {
        if (!("serviceWorker" in navigator)) {
            const message =
                "Service Workers are not supported in your browser.";
            console.error(message);
            alert(message);
            return;
        }

        if (
            typeof Notification === "undefined" &&
            /iP(ad|hone|od).*OS/.test(navigator.userAgent)
        ) {
            alert(
                "To enable notifications, please add this app to your home screen first.",
            );
            return;
        }
        const permission = await Notification.requestPermission();
        console.info("Notification permission", permission);
        if (permission !== "granted") {
            const message = "Notification permission denied.";
            console.error(message);
            alert(message);
            return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        let subscription = await registration.pushManager
            .getSubscription();

        if (subscription) {
            console.info("Existing subscription", subscription);
        } else {
            console.info("Subscribing");
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey,
            });
            console.info("Subscribed", subscription);
        }

        // There's a bug in Safari 18.0.1 for macOS:
        // https://bugs.webkit.org/show_bug.cgi?id=281155
        console.info("Subscription", subscription);
        // TODO: How to update subscription? UX? APIs?

        const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscription: subscription,
                programIds: programIds,
            }),
        });

        if (response.ok) {
            setSubscribed(true);
        } else {
            alert(`Subscription failed: ${response.statusText}`);
        }
    };

    return (
        <button
            onClick={() => {
                if (subscribed) {
                    unsubscribeUser();
                } else {
                    subscribeUser();
                }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                subscribed
                    ? "bg-logoBlue bg-opacity-80 text-white"
                    : "bg-logoBlue text-white hover:bg-blue-600"
            }
            ${subscribed === null ? "opacity-0 cursor-not-allowed" : null}`}
        >
            {subscribed ? <BellAlertIcon /> : <BellIcon />}
            {subscribed ? "Enabled" : "Notify"}
        </button>
    );
}
