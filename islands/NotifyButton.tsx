import { useState } from "preact/hooks";

type NotifyProps = {
    programIds: number[];
    vapidPublicKey: string;
};

export default function NotifyButton(
    { programIds, vapidPublicKey }: NotifyProps,
) {
    const [subscribed, setSubscribed] = useState(false);

    const subscribeUser = async () => {
        if (!("serviceWorker" in navigator)) {
            alert("Service Workers are not supported in your browser.");
            return;
        }

        const permission = await Notification.requestPermission();
        console.info("Notification permission", permission);
        if (permission !== "granted") {
            alert("Notification permission denied.");
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
            alert("Subscribed successfully!");
        } else {
            alert("Subscription failed.");
        }
    };

    return (
        <button onClick={subscribeUser} disabled={subscribed}>
            {subscribed ? "Subscribed" : "Notify Me"}
        </button>
    );
}
