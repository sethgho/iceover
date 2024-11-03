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
        if (permission !== "granted") {
            alert("Notification permission denied.");
            return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey,
        });

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
