import { Handlers, PageProps } from "$fresh/server.ts";
import LogoWithText from "../components/LogoWithText.tsx";
import {
  getAvailableEvents,
  getProgramLabel,
  IceEvent,
  ProgramId,
  Programs,
} from "../icehouseApi.ts";
import NotifyButton from "../islands/NotifyButton.tsx";
import SearchForm, { SearchQuery } from "../islands/SearchForm.tsx";
import { VAPID_PUBLIC_KEY } from "../utils/config.ts";

type PageData = {
  query: SearchQuery;
  result: IceEvent[];
  vapidKey: string;
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
      vapidKey: VAPID_PUBLIC_KEY,
    });
  },
};

export default function Home({ data }: PageProps<PageData>) {
  const { query, result, vapidKey } = data;
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center gap-8">
        <LogoWithText />
        <SearchForm query={query} />
        <div class="w-full">
          <div class="flex justify-between">
            <h2 class="text-xl font-bold mb-2">Upcoming Events</h2>
            <NotifyButton
              programIds={query.programs}
              vapidPublicKey={vapidKey}
            />
          </div>
          <div class="flex flex-col gap-2">
            {result.map((event) => (
              <div key={event.eventId} class="p-4 border rounded bg-white">
                <div className="flex justify-between">
                  <h3 class="font-semibold">{event.eventName}</h3>
                  <p class="text-gray-600 hidden sm:block">
                    {new Date(event.eventStartDate).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p class="text-gray-600 sm:hidden">
                    {new Date(event.eventStartDate).toLocaleDateString([], {
                      weekday: "long",
                    })}
                  </p>
                </div>
                <div class="flex justify-between">
                  <span>
                    {getProgramLabel(event.programId)}
                  </span>
                  <p class="">
                    <span class="hidden md:inline">
                      {"Time: "}
                    </span>
                    {new Date(
                      `${event.eventStartDate} ${event.eventStartTime}`,
                    )
                      .toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    <span class="hidden md:inline">
                      {" "}- {new Date(
                        `${event.eventStartDate} ${event.eventEndTime}`,
                      )
                        .toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                    </span>
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
