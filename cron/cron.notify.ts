export function initCronJobs() {
    const isBuildMode = Deno.args.includes("build");
    if (isBuildMode) {
        return;
    }
    console.log("Initializing cron jobs");

    Deno.cron("Log a message", { minute: { every: 1 } }, () => {
        console.log("Minutely cron task.");
    });

    Deno.cron("Notify users at 8pm", { hour: { exact: 20 } }, () => {
        console.log("STUB: Notify users - 8pm");
    });

    Deno.cron("Notify users hourly", { hour: { every: 1 } }, () => {
        console.log("STUB: Notify users - hourly");
    });
}
