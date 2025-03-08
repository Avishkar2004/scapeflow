import { intervalToDuration } from "date-fns";

export function DatesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined
) {
  if (!start || !end) return null;

  const timeElpased = end.getTime() - start.getTime();
  if (timeElpased < 1000) {
    // Less then 1 second
    return `${timeElpased}ms `;
  }
  const duration = intervalToDuration({
    start: 0,
    end: timeElpased,
  });
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}
