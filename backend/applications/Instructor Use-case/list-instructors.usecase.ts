import type { InstructorQueryRepository } from "./instructor.specialized.use-case.interface";
export class ListInstructorsWithFiltersUseCase {
  constructor(private readonly repository: InstructorQueryRepository) {}
  async execute(input: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const result = await this.repository.findPage({
      ...input,
      offset: (page - 1) * limit,
      limit,
    });
    return {
      ...result,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
