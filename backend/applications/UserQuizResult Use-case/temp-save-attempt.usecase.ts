import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type { RawAttemptAnswer } from "./user-quiz-result.specialized.use-case.interface";
import { normalizeEntityId } from "../use-case.helpers";
export class TempSaveAttemptUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(
    resultId: string | number,
    answers: RawAttemptAnswer[],
  ): Promise<void> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.repository.getById(key);
    if (!result) throw new Error(`UserQuizResult ${key} not found`);
    result.tempSave(answers);
    await this.repository.update(key, result);
  }
}
