import { createAttemptAutosave } from "./attemptAutosave";

describe("createAttemptAutosave", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("coalesces changes within the save interval", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const autosave = createAttemptAutosave({ save, delay: 500 });

    autosave.schedule({ answer: "a" });
    autosave.schedule({ answer: "latest" });
    jest.advanceTimersByTime(500);
    await Promise.resolve();
    await Promise.resolve();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({ answer: "latest" });
  });

  it("serializes in-flight saves and flushes the newest pending snapshot", async () => {
    let finishFirst;
    const save = jest
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishFirst = resolve;
          }),
      )
      .mockResolvedValue(undefined);
    const autosave = createAttemptAutosave({ save, delay: 100 });

    autosave.schedule("first");
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    await Promise.resolve();
    autosave.schedule("second");
    jest.advanceTimersByTime(100);
    expect(save).toHaveBeenCalledTimes(1);

    finishFirst();
    await Promise.resolve();
    await Promise.resolve();
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    await Promise.resolve();

    expect(save).toHaveBeenNthCalledWith(2, "second");
  });
});
