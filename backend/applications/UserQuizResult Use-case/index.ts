export * from "./user-quiz-result.use-case.interface";
export { CreateUserQuizResultUseCase } from "./create-user-quiz-result.usecase";
export {
  GetUserQuizResultByIdUseCase,
  GetUserQuizResultByIdUseCase as GetUserQuizResultUseCase,
} from "./get-user-quiz-result-by-id.usecase";
export {
  GetAllUserQuizResultsUseCase,
  GetAllUserQuizResultsUseCase as ListUserQuizResultsUseCase,
} from "./get-all-user-quiz-results.usecase";
export { UpdateUserQuizResultUseCase } from "./update-user-quiz-result.usecase";
export { DeleteUserQuizResultUseCase } from "./delete-user-quiz-result.usecase";
export * from "./user-quiz-result.specialized.use-case.interface";
export { StartAttemptUseCase } from "./start-attempt.usecase";
export { TempSaveAttemptUseCase } from "./temp-save-attempt.usecase";
export { SubmitAttemptUseCase } from "./submit-attempt.usecase";
export { GetLatestAttemptUseCase } from "./get-latest-attempt.usecase";
export { GetAllAttemptsUseCase } from "./get-all-attempts.usecase";
export { GetBestAttemptUseCase } from "./get-best-attempt.usecase";
export { GetBestAttemptsByQuizUseCase } from "./get-best-attempts-by-quiz.usecase";
export { GetBestAttemptsByUserUseCase } from "./get-best-attempts-by-user.usecase";
export { GetUserResultsStatsUseCase } from "./get-user-results-stats.usecase";
