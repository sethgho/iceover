import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAvailableEvents, Event } from "../icehouseApi.ts";


export const handler: Handlers = {
  async GET(_req, ctx) {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const events = await getAvailableEvents(startDate, endDate, ["PublicSessions", "StickAndPuck"]);
    if (!events) {
      ctx.renderNotFound()
      return ctx.renderNotFound({
        message: "No events found",
      });
    }
    return ctx.render(events);
  },
};

export default function Home(props: PageProps<Event[]>) {
  const count = useSignal(3);
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <Counter count={count} />
        <div class="mt-8 w-full">
          <h2 class="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div class="space-y-4">
            {props.data.map((event) => (
              <div key={event.eventId} class="p-4 border rounded bg-white">
                <h3 class="font-semibold">{event.eventName}</h3>
                <p class="text-gray-600">
                  Start: {new Date(event.eventStartDate).toLocaleDateString()}                  
                </p>
                <p>
                Time: {event.eventStartTime} - {event.eventEndTime}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
