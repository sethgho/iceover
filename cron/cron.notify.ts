import { notifyUsers } from "../utils/notify.ts";

export function initCronJobs() {
    const isBuildMode = Deno.args.includes("build");
    if (isBuildMode) {
        return;
    }
    console.log("Initializing cron jobs");

    // Deno.cron("Log a message", { minute: { every: 1 } }, () => {
    //     console.log("Minutely cron task.");
    // });

    // 8pm CST, 2am UTC
    Deno.cron("Notify users at 8pm", { hour: { exact: 2 } }, async () => {
        console.log("STUB: Notify users - 8pm CST");
        await notifyUsers();
    });

    // Deno.cron("Notify users hourly", { hour: { every: 1 } }, async () => {
    //     console.log("TEST: Notify users - hourly");
    //     await notifyUsers();
    // });
}
