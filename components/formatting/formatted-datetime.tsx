"use client";

import { useFormatDateTime } from "@/lib/hooks/use-format-datetime";

export function FormattedDateTime({
  value,
  withSeconds = true,
}: {
  value: string | null | undefined;
  withSeconds?: boolean;
}) {
  const { format, formatWithSeconds } = useFormatDateTime();

  if (!value) {
    return <>—</>;
  }

  return <>{withSeconds ? formatWithSeconds(value) : format(value)}</>;
}
