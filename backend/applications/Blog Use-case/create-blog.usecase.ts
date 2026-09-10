import { BlogEntity } from "../../domain/entities";
import type { BlogRepository } from "../../domain/repositories/blog.repository.interface";
import type { CreateBlogInput } from "./blog.use-case.interface";
import {
  asInputValidationError,
  BlogInputValidationError,
} from "./blog.exceptions";

export class CreateBlogUseCase {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(input: CreateBlogInput): Promise<BlogEntity> {
    if (!input || typeof input !== "object") {
      throw new BlogInputValidationError("Blog input must be an object");
    }

    let blog: BlogEntity;
    try {
      blog = BlogEntity.create(input);
    } catch (error) {
      throw asInputValidationError(error);
    }

    return this.blogRepository.create(blog);
  }
}

