import {
  ATTEMPT_DEADLINE_GRACE_MS,
  isPastAttemptDeadline,
} from "../attempt-deadline.helpers";

describe("isPastAttemptDeadline", () => {
  it("applies the grace period as a strict boundary", () => {
    const deadline = new Date("2026-11-18T10:00:00.000Z");
    const graceEndsAt = new Date(
      deadline.getTime() + ATTEMPT_DEADLINE_GRACE_MS,
    );

    expect(isPastAttemptDeadline(deadline, graceEndsAt)).toBe(false);
    expect(
      isPastAttemptDeadline(
        deadline,
        new Date(graceEndsAt.getTime() + 1),
      ),
    ).toBe(true);
  });
});
