import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { initCronJobs } from "./cron/cron.notify.ts";

initCronJobs();

export default defineConfig({
  plugins: [tailwind()],
});
