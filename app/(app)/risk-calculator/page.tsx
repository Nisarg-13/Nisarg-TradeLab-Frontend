import { PageHeader } from "@/components/layout/page-header";
import { RiskCalculator } from "@/components/risk/risk-calculator";

export default function RiskCalculatorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tools"
        title="Risk Calculator"
        description="Enter any account balance, pick an instrument, and calculate position size from your risk and stop distance."
      />

      <RiskCalculator />
    </div>
  );
}
