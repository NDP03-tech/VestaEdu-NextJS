import { BlogEntity } from "../../domain/entities";
import type { BlogRepository } from "../../domain/repositories/blog.repository.interface";

export class GetAllBlogsUseCase {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(): Promise<BlogEntity[]> {
    const blogs = await this.blogRepository.getAll();
    return blogs ?? [];
  }
}

export { GetAllBlogsUseCase as ListBlogsUseCase };
