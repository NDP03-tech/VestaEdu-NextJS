import {
  AttemptCounterEntity,
  QuizEntity,
  UserQuizResultEntity,
} from "../../../domain/entities";
import type { AttemptStartTransaction } from "../user-quiz-result.specialized.use-case.interface";
import { StartAttemptUseCase } from "../start-attempt.usecase";

function createHarness({
  quiz = QuizEntity.create(),
  counterCount = 0,
  hasPassedAttempt = false,
  activeAttempt = null,
}: {
  quiz?: QuizEntity;
  counterCount?: number;
  hasPassedAttempt?: boolean;
  activeAttempt?: UserQuizResultEntity | null;
} = {}) {
  const counter = AttemptCounterEntity.create({
    userId: 3,
    quizId: 8,
    count: counterCount,
  });
  let latestAttempt: UserQuizResultEntity | null = activeAttempt;
  let committedTransactions = 0;
  let lock = Promise.resolve();
  const transaction = {
    counter,
    getQuiz: jest.fn().mockResolvedValue(quiz),
    getUnsubmittedAttempt: jest.fn(async () =>
      latestAttempt && !latestAttempt.isSubmitted() ? latestAttempt : null,
    ),
    hasPassedAttempt: jest.fn().mockResolvedValue(hasPassedAttempt),
    saveCounter: jest.fn().mockResolvedValue(undefined),
    createAttempt: jest.fn(async (result: UserQuizResultEntity) => {
      latestAttempt = result;
      return result;
    }),
    updateAttempt: jest.fn(async (result: UserQuizResultEntity) => {
      latestAttempt = result;
    }),
  } satisfies AttemptStartTransaction;
  const startRepository = {
    withUserQuizStartLock: async <T>(
      _userId: number,
      _quizId: number,
      operation: (value: AttemptStartTransaction) => Promise<T>,
    ): Promise<T> => {
      const previousLock = lock;
      let release!: () => void;
      lock = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previousLock;
      try {
        const outcome = await operation(transaction);
        committedTransactions += 1;
        return outcome;
      } finally {
        release();
      }
    },
  };
  const queries = {
    getQuestions: jest.fn().mockResolvedValue([]),
  };

  return {
    counter,
    queries,
    startRepository,
    transaction,
    getLatestAttempt: () => latestAttempt,
    getCommittedTransactions: () => committedTransactions,
    useCase: new StartAttemptUseCase(startRepository, queries),
  };
}

describe("StartAttemptUseCase", () => {
  it("uses the default practice mode and sets a timed attempt deadline", async () => {
    const quiz = QuizEntity.create({ uiSettings: { timeLimit: 45 } });
    const harness = createHarness({ quiz });
    const startedAt = Date.now();

    const result = await harness.useCase.execute(3, 8);

    expect(quiz.uiSettings.mode).toBe("practice");
    expect(result.deadline?.getTime()).toBeGreaterThanOrEqual(
      startedAt + 45 * 60 * 1000,
    );
    expect(result.deadline?.getTime()).toBeLessThanOrEqual(
      Date.now() + 45 * 60 * 1000,
    );
    expect(result.quizVersion).toBe(quiz.version);
    expect(result.attemptNumber).toBe(1);
    expect(harness.transaction.saveCounter).toHaveBeenCalledTimes(1);
    expect(harness.transaction.createAttempt).toHaveBeenCalledWith(result);
  });

  it("does not set a deadline when the quiz has no time limit", async () => {
    const harness = createHarness({
      quiz: QuizEntity.create({ uiSettings: { timeLimit: 0 } }),
    });

    const result = await harness.useCase.execute(3, 8);

    expect(result.deadline).toBeNull();
  });

  it("rejects attempts for draft quizzes before creating counters or results", async () => {
    const quiz = QuizEntity.create({ status: "draft" });
    const harness = createHarness({ quiz });

    await expect(harness.useCase.execute(3, 8)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(harness.transaction.getUnsubmittedAttempt).not.toHaveBeenCalled();
    expect(harness.transaction.saveCounter).not.toHaveBeenCalled();
    expect(harness.transaction.createAttempt).not.toHaveBeenCalled();
  });

  it("returns the same in-progress attempt for concurrent start requests", async () => {
    const quiz = QuizEntity.create({
      uiSettings: { mode: "exam", timeLimit: 45, maxAttempts: 1 },
    });
    const harness = createHarness({ quiz });

    const [first, second] = await Promise.all([
      harness.useCase.execute(3, 8),
      harness.useCase.execute(3, 8),
    ]);

    expect(first).toBe(second);
    expect(first.attemptNumber).toBe(1);
    expect(harness.transaction.saveCounter).toHaveBeenCalledTimes(1);
    expect(harness.transaction.createAttempt).toHaveBeenCalledTimes(1);
    expect(harness.transaction.hasPassedAttempt).toHaveBeenCalledTimes(1);
  });

  it("blocks an exam after the student reaches the passing score before checking max attempts", async () => {
    const harness = createHarness({
      quiz: QuizEntity.create({
        uiSettings: { mode: "exam", maxAttempts: 2 },
      }),
      counterCount: 2,
      hasPassedAttempt: true,
    });

    await expect(harness.useCase.execute(3, 8)).rejects.toMatchObject({
      statusCode: 409,
      code: "ALREADY_PASSED",
    });
    expect(harness.transaction.saveCounter).not.toHaveBeenCalled();
    expect(harness.transaction.createAttempt).not.toHaveBeenCalled();
  });

  it("blocks an exam when max attempts are exhausted", async () => {
    const harness = createHarness({
      quiz: QuizEntity.create({
        uiSettings: { mode: "exam", maxAttempts: 2 },
      }),
      counterCount: 2,
    });

    await expect(harness.useCase.execute(3, 8)).rejects.toMatchObject({
      statusCode: 409,
      code: "NO_ATTEMPTS_LEFT",
    });
    expect(harness.transaction.saveCounter).not.toHaveBeenCalled();
  });

  it("commits an overdue auto-submit even when no new attempt is allowed", async () => {
    const activeAttempt = UserQuizResultEntity.create({
      userId: 3,
      quizId: 8,
      attemptNumber: 1,
      deadline: new Date(Date.now() - 31_000),
    });
    activeAttempt.tempSave([{ questionId: 11, answer: "saved" }]);
    const harness = createHarness({
      quiz: QuizEntity.create({
        uiSettings: { mode: "exam", maxAttempts: 1 },
      }),
      counterCount: 1,
      activeAttempt,
    });

    await expect(harness.useCase.execute(3, 8)).rejects.toMatchObject({
      statusCode: 409,
      code: "NO_ATTEMPTS_LEFT",
    });

    expect(harness.transaction.updateAttempt).toHaveBeenCalledWith(
      activeAttempt,
    );
    expect(harness.getLatestAttempt()?.submittedLate).toBe(true);
    expect(harness.getCommittedTransactions()).toBe(1);
  });

  it("ignores passing-score and max-attempt gates for practice", async () => {
    const harness = createHarness({
      quiz: QuizEntity.create({
        uiSettings: { mode: "practice", maxAttempts: 1 },
      }),
      counterCount: 2,
      hasPassedAttempt: true,
    });

    const result = await harness.useCase.execute(3, 8);

    expect(result.attemptNumber).toBe(3);
    expect(harness.transaction.hasPassedAttempt).not.toHaveBeenCalled();
  });
});
