import type { UserQueryRepository } from "./user.specialized.use-case.interface";
export class GetQuizzesForUserUseCase {
  constructor(private readonly repository: UserQueryRepository) {}
  async execute(userId: string | number) {
    return this.repository.getQuizzesForUser(String(userId));
  }
}
