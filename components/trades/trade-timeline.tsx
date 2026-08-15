import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedDateTime } from "@/components/formatting/formatted-datetime";
import type { TradeEvent } from "@/types/trade";

function formatEventLabel(type: TradeEvent["type"]) {
  return type.replaceAll("_", " ");
}

export function TradeTimeline({ events }: { events: TradeEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>Trade lifecycle events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No events recorded.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-l-2 pl-4">
              <p className="font-medium">{formatEventLabel(event.type)}</p>
              <p className="text-muted-foreground text-sm">
                <FormattedDateTime value={event.occurredAt} />
              </p>
              {event.newValue ? (
                <p className="text-sm">{event.newValue}</p>
              ) : null}
              {event.previousValue ? (
                <p className="text-muted-foreground text-xs">
                  From {event.previousValue}
                </p>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
