export const PLAN_COMPLIANCE_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "FOLLOWED", label: "Followed plan" },
  { value: "PARTIALLY_FOLLOWED", label: "Partially followed" },
  { value: "DID_NOT_FOLLOW", label: "Did not follow" },
  { value: "NOT_REVIEWED", label: "Not reviewed" },
] as const;

export type PlanComplianceStatus =
  (typeof PLAN_COMPLIANCE_OPTIONS)[number]["value"];
