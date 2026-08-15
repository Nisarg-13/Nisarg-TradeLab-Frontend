import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Frontend Phase 0 — Foundation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Nisarg&apos;s TradeLab
          </h1>
          <p className="text-lg text-muted-foreground">
            Track. Analyze. Improve.
          </p>
        </div>

        <p className="max-w-lg text-muted-foreground">
          UI for your personal trading journal. This frontend talks to{" "}
          <strong>Nisarg-TradeLab-Backend</strong> over HTTPS — it never
          connects directly to PostgreSQL, Gemini, or MT5.
        </p>

        <Button variant="outline" disabled>
          Sign in (Phase 1)
        </Button>
      </main>
    </div>
  );
}
