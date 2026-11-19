export const createAttemptAutosave = ({
  save,
  delay = 3000,
  onStatus = () => {},
  onError = () => {},
}) => {
  let timer = null;
  let pending = null;
  let inFlight = null;
  let disposed = false;

  const flush = async () => {
    timer = null;
    if (disposed || inFlight || pending === null) return;
    const snapshot = pending;
    pending = null;
    onStatus("saving");
    inFlight = Promise.resolve().then(() => save(snapshot));

    try {
      await inFlight;
      if (!disposed) onStatus("saved");
    } catch (error) {
      if (!disposed) {
        onStatus("error");
        onError(error);
      }
    } finally {
      inFlight = null;
      if (pending !== null && !disposed) {
        timer = setTimeout(flush, delay);
      }
    }
  };

  return {
    schedule(value) {
      pending = value;
      onStatus("pending");
      if (!inFlight && timer === null) timer = setTimeout(flush, delay);
    },
    cancelPending() {
      clearTimeout(timer);
      timer = null;
      pending = null;
    },
    waitForIdle() {
      return inFlight?.catch(() => {}) ?? Promise.resolve();
    },
    dispose() {
      disposed = true;
      clearTimeout(timer);
      timer = null;
      pending = null;
    },
  };
};
