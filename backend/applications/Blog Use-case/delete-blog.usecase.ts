import type { BlogRepository } from "../../domain/repositories/blog.repository.interface";
import { normalizeBlogId } from "./blog.helpers";

export class DeleteBlogUseCase {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(id: string | number): Promise<void> {
    await this.blogRepository.delete(normalizeBlogId(id));
  }
}
