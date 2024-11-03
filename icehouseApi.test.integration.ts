// events_integration_test.ts
import {
  assert,
  assertStrictEquals,
} from "https://deno.land/std@0.203.0/assert/mod.ts";
import { getAvailableEvents, Programs } from "./icehouseApi.ts";

Deno.test("Integration test: getAvailableEvents with real API", async () => {
  // Define the start and end dates for the test
  const startDate = new Date("2024-10-28");
  const endDate = new Date("2024-11-30"); // Use a future end date to ensure we get results

  // Test fetching all events without filtering
  const allEvents = await getAvailableEvents(startDate, endDate);
  assert(allEvents.length > 0, "No events found within the given date range.");

  // Test fetching events filtered by program IDs
  const programIds = [
    Programs.FreestyleSessions.id,
    Programs.PublicSessions.id,
  ];
  const filteredEvents = await getAvailableEvents(
    startDate,
    endDate,
    programIds,
  );

  // Validate that we received filtered events
  assert(
    filteredEvents.length > 0,
    "No filtered events found within the given date range.",
  );
  assert(
    filteredEvents.length <= allEvents.length,
    "Filtered events should be fewer than or equal to all events",
  );

  // Verify all returned events belong to the specified programs
  for (const event of filteredEvents) {
    assert(
      programIds.includes(event.programId),
      `Event ${event.eventId} has unexpected programId ${event.programId}`,
    );
  }

  // Check the structure of the first filtered event
  const firstEvent = filteredEvents[0];

  // Ensure the types of the first event's properties
  assertStrictEquals(typeof firstEvent.eventId, "number");
  assertStrictEquals(typeof firstEvent.eventName, "string");
  assertStrictEquals(typeof firstEvent.eventStartDate, "string");
  assertStrictEquals(typeof firstEvent.eventEndDate, "string");
  assertStrictEquals(typeof firstEvent.programId, "number");

  console.log(`Fetched ${filteredEvents.length} filtered events from the API.`);
});
