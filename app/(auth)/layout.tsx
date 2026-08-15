import { PublicThemeToggle } from "@/components/layout/public-theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-10">
      <PublicThemeToggle />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
