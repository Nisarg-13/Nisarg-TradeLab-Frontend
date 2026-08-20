import { ProductPreviewTabs } from "@/components/landing/product-preview-tabs";

export function ProductPreview() {
  return (
    <section className="px-6 pb-20 md:pb-28" aria-label="Product preview">
      <div className="mx-auto w-full max-w-6xl">
        <div className="border-border/80 from-card/80 to-background landing-preview-glow relative overflow-hidden rounded-2xl border bg-gradient-to-b p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-6">
          <div className="border-border/60 bg-background/70 mb-4 flex items-center gap-2 rounded-lg border px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="bg-loss/80 size-2.5 rounded-full" />
              <span className="bg-primary/80 size-2.5 rounded-full" />
              <span className="bg-success/80 size-2.5 rounded-full" />
            </div>
            <p className="text-muted-foreground mx-auto text-xs md:text-sm">
              Product preview — sample data for illustration
            </p>
          </div>
          <ProductPreviewTabs />
        </div>
      </div>
    </section>
  );
}
