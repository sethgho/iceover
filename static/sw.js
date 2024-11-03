self.addEventListener("push", function (event) {
    const data = event.data.json();
    console.log("Push event", { event, data });
    const title = data.title || "Notification";
    const options = {
        data,
        body: data.body || "You have a new notification.",
        icon: "/icon.png", // Optional: Add an icon
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    console.log("Notification clicked", event);
    const data = event.notification.data;
    if (data.type !== "alert") {
        event.notification.close();
        return;
    }

    const urlToOpen = new URL(data.url, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        }).then(function (clientList) {
            // If there's already a window/tab open with the target URL, focus it
            for (const client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    console.log("Focusing existing window", client);
                    return client.focus();
                }
            }
            // If not, open a new window/tab with the target URL
            if (clients.openWindow) {
                console.log("Opening new window", urlToOpen);
                return clients.openWindow(urlToOpen);
            }
        }),
    );
});
