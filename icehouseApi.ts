export type ProgramId = (typeof Programs)[keyof typeof Programs]["id"];

export const Programs: Record<string, { id: number; label: string }> = {
    LearnToSkate: { id: 4713, label: "Learn to Skate" },
    HolidayShow: { id: 5039, label: "Holiday Show" },
    FreestyleSessions: { id: 4795, label: "Freestyle Sessions" },
    StickAndPuck: { id: 4800, label: "Stick and Puck" },
    PublicSessions: { id: 4715, label: "Public Sessions" },
};

export function getProgramLabel(programId: ProgramId) {
    return Object.values(Programs).find((p) => p.id === programId)?.label;
}

export interface Event {
    eventId: number;
    eventName: string;
    eventStartDate: string;
    eventEndDate: string;
    programId: number;
    spaces: {
        spaceName: string;
        spaceId: number;
    }[];
    eventStartTime: string;
    eventEndTime: string;
}

async function fetchEvents(
    startDate: Date,
    endDate: Date,
    programIds?: ProgramId[],
): Promise<Event[]> {
    const baseUrl =
        "https://api.bondsports.co/v4/facilities/423/programs-schedule";
    const url = new URL(baseUrl);
    url.searchParams.set("startDate", startDate.toISOString().split("T")[0]);
    url.searchParams.set("endDate", endDate.toISOString().split("T")[0]);
    if (programIds) {
        url.searchParams.set("programsIds", programIds.join(","));
    }

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
    return data.data;
}

export function getAvailableEvents(
    startDate: Date,
    endDate: Date,
    programIds?: ProgramId[],
) {
    return fetchEvents(startDate, endDate, programIds);
}
