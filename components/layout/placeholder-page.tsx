import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PlaceholderPage({
  title,
  description,
  cardTitle = "In development",
  cardDescription = "This module is on the roadmap and will ship in a future phase.",
  cardBody = "Existing navigation and APIs remain unchanged — only the visual shell is live while functionality is built out.",
}: {
  title: string;
  description: string;
  cardTitle?: string;
  cardDescription?: string;
  cardBody?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-primary text-xs font-medium tracking-[0.2em] uppercase">
          Coming soon
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{cardBody}</p>
        </CardContent>
      </Card>
    </div>
  );
}
