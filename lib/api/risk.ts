import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  CalculateRiskInput,
  RiskCalculationResult,
  RiskInstrument,
} from "@/types/risk";

export async function listRiskInstruments(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<RiskInstrument[]>>(
    "/api/v1/risk/instruments",
    { getAuthToken },
  );
}

export async function calculateRisk(
  getAuthToken: () => Promise<string | null>,
  input: CalculateRiskInput,
) {
  return apiRequest<ApiDataResponse<RiskCalculationResult>>(
    "/api/v1/risk/calculate",
    {
      method: "POST",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}
