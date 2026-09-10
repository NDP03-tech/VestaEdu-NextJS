import { BlogEntity } from "../../domain/entities";
import type { BlogRepository } from "../../domain/repositories/blog.repository.interface";
import { BlogNotFoundException } from "./blog.exceptions";
import { normalizeBlogId } from "./blog.helpers";

export class GetBlogByIdUseCase {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(id: string | number): Promise<BlogEntity> {
    const normalizedId = normalizeBlogId(id);
    const blog = await this.blogRepository.getById(normalizedId);

    if (!blog) {
      throw new BlogNotFoundException(normalizedId);
    }

    return blog;
  }
}

export { GetBlogByIdUseCase as GetBlogUseCase };
