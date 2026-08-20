import { cn } from "@/lib/utils";

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  variant = "default",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted";
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-border/60 scroll-mt-20 border-b px-6 py-20 md:py-24",
        variant === "muted" && "bg-card/30",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          {eyebrow ? (
            <p className="text-primary mb-3 text-xs font-medium tracking-[0.25em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground mt-4 text-base leading-relaxed md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
