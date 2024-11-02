// events.ts
export type ProgramId =
  | "LearnToSkate" // 4713
  | "HolidayShow" // 5039
  | "FreestyleSessions" // 4795
  | "StickAndPuck" // 4800
  | "PublicSessions"; // 4715

const programIdMapping: Record<ProgramId, number> = {
  LearnToSkate: 4713,
  HolidayShow: 5039,
  FreestyleSessions: 4795,
  StickAndPuck: 4800,
  PublicSessions: 4715,
};

interface Event {
  eventId: number;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  programId: number;
}

async function fetchEvents(
  startDate: string,
  endDate: string,
  programIds?: ProgramId[],
): Promise<Event[]> {
  const baseUrl =
    "https://api.bondsports.co/v4/facilities/423/programs-schedule";
  const url = new URL(baseUrl);
  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);

  const response = await fetch(url.toString(), {
    headers: {
      "accept": "*/*",
      "origin": "https://bondsports.co",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data.data.filter((event: Event) => {
    if (!programIds) return true; // No filtering if no programIds are specified
    const programName = getProgramIdName(event.programId);
    return programName ? programIds.includes(programName) : false;
  });
}

function getProgramIdName(id: number): ProgramId | undefined {
  return Object.entries(programIdMapping).find(([_, value]) => value === id)
    ?.[0] as ProgramId;
}

export function getAvailableEvents(
  startDate: string,
  endDate: string,
  programIds?: ProgramId[],
) {
  return fetchEvents(startDate, endDate, programIds);
}
