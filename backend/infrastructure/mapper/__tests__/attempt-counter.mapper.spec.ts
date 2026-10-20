import { AttemptCounterEntity } from "../../../domain/entities";

describe("AttemptCounterEntity", () => {
  it("should reconstitute entity properly", () => {
    const domain = AttemptCounterEntity.reconstitute({
      id: 2,
      userId: 99,
      quizId: 5,
      count: 1,
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-02"),
    });

    expect(domain.id).toBe(2);
    expect(domain.userId).toBe(99);
    expect(domain.quizId).toBe(5);
    expect(domain.count).toBe(1);
  });

  it("should increment attempt count", () => {
    const domain = AttemptCounterEntity.reconstitute({
      id: 2,
      userId: 99,
      quizId: 5,
      count: 1,
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-02"),
    });

    domain.increment();
    expect(domain.count).toBe(2);
  });
});
