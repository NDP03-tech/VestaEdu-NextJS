import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type { RawAttemptAnswer } from "./user-quiz-result.specialized.use-case.interface";
import { normalizeEntityId } from "../use-case.helpers";
import { AttemptOwnershipError } from "./user-quiz-result.exceptions";
export class TempSaveAttemptUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(
    resultId: string | number,
    userId: number,
    answers: RawAttemptAnswer[],
    state?: Record<string, unknown>,
  ): Promise<void> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.repository.getById(key);
    if (!result) throw new Error(`UserQuizResult ${key} not found`);
    if (result.userId !== userId) throw new AttemptOwnershipError();
    result.tempSave(answers, state);
    await this.repository.update(key, result);
  }
}
