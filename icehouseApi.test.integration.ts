// events_integration_test.ts
import {
  assert,
  assertStrictEquals,
} from "https://deno.land/std@0.203.0/assert/mod.ts";
import { getAvailableEvents } from "./icehouseApi.ts";

Deno.test("Integration test: getAvailableEvents with real API", async () => {
  // Define the start and end dates for the test
  const startDate = "2024-10-28";
  const endDate = "2024-11-30"; // Use a future end date to ensure we get results

  // Fetch all events without filtering by programIds
  const events = await getAvailableEvents(startDate, endDate);

  // Validate that we received events
  assert(events.length > 0, "No events found within the given date range.");

  // Check the structure of the first event
  const firstEvent = events[0];

  // Ensure the types of the first event's properties
  assertStrictEquals(typeof firstEvent.eventId, "number");
  assertStrictEquals(typeof firstEvent.eventName, "string");
  assertStrictEquals(typeof firstEvent.eventStartDate, "string");
  assertStrictEquals(typeof firstEvent.eventEndDate, "string");
  assertStrictEquals(typeof firstEvent.programId, "number");

  console.log(`Fetched ${events.length} events from the API.`);
});
