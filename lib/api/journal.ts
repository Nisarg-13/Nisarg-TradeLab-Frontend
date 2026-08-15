import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  DailyJournal,
  DailyJournalInput,
  ListDailyJournalQuery,
  UpdateDailyJournalInput,
} from "@/types/journal";

function buildQuery(params: ListDailyJournalQuery) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function listDailyJournalEntries(
  getAuthToken: () => Promise<string | null>,
  query: ListDailyJournalQuery = {},
) {
  return apiRequest<ApiDataResponse<DailyJournal[]>>(
    `/api/v1/daily-journal${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getDailyJournalEntry(
  getAuthToken: () => Promise<string | null>,
  entryId: string,
) {
  return apiRequest<ApiDataResponse<DailyJournal>>(
    `/api/v1/daily-journal/${entryId}`,
    { getAuthToken },
  );
}

export async function createDailyJournalEntry(
  getAuthToken: () => Promise<string | null>,
  input: DailyJournalInput,
) {
  return apiRequest<ApiDataResponse<DailyJournal>>("/api/v1/daily-journal", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateDailyJournalEntry(
  getAuthToken: () => Promise<string | null>,
  entryId: string,
  input: UpdateDailyJournalInput,
) {
  return apiRequest<ApiDataResponse<DailyJournal>>(
    `/api/v1/daily-journal/${entryId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}
