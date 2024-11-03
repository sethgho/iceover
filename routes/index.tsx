import { Handlers, PageProps } from "$fresh/server.ts";
import LogoWithText from "../components/LogoWithText.tsx";
import {
  Event,
  getAvailableEvents,
  getProgramLabel,
  ProgramId,
  Programs,
} from "../icehouseApi.ts";
import SearchForm, { SearchQuery } from "../islands/SearchForm.tsx";

type PageData = {
  query: SearchQuery;
  result: Event[];
};
export const handler: Handlers<PageData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    let programs: number[] = url.searchParams.getAll("program").map(Number);
    if (programs.length === 0) {
      programs = Object.values(Programs).map((p) => p.id);
    }

    const startDate = new Date();
    const endDate = new Date(Date.now() + (86400000 * 2));
    const events = await getAvailableEvents(
      startDate,
      endDate,
      programs as ProgramId[],
    );

    return ctx.render({
      query: {
        programs,
        startDate,
        endDate,
      },
      result: events,
    });
  },
};

export default function Home({ data }: PageProps<PageData>) {
  const { query, result } = data;
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center gap-8">
        <LogoWithText />
        <SearchForm query={query} />
        <div class="w-full">
          <h2 class="text-xl font-bold mb-2">Upcoming Events</h2>
          <div class="flex flex-col gap-2">
            {result.map((event) => (
              <div key={event.eventId} class="p-4 border rounded bg-white">
                <div className="flex justify-between">
                  <h3 class="font-semibold">{event.eventName}</h3>
                  <p class="text-gray-600">
                    {new Date(event.eventStartDate).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div class="flex justify-between">
                  <span>
                    {getProgramLabel(event.programId)}
                  </span>
                  <p>
                    Time:{" "}
                    {new Date(`${event.eventStartDate} ${event.eventStartTime}`)
                      .toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })} -{" "}
                    {new Date(`${event.eventStartDate} ${event.eventEndTime}`)
                      .toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
