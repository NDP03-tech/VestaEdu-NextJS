export const ATTEMPT_DEADLINE_GRACE_MS = 30_000;

export function isPastAttemptDeadline(
  deadline: Date | null,
  now: Date = new Date(),
): boolean {
  return (
    deadline !== null &&
    now.getTime() > deadline.getTime() + ATTEMPT_DEADLINE_GRACE_MS
  );
}
