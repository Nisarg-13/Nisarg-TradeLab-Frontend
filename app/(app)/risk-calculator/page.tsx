import { RiskCalculator } from "@/components/risk/risk-calculator";

export default function RiskCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Tools</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Risk Calculator
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Enter any account balance, pick an instrument, and calculate position
          size from your risk and stop distance.
        </p>
      </div>

      <RiskCalculator />
    </div>
  );
}
