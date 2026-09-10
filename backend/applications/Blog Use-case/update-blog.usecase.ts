import { BlogEntity } from "../../domain/entities";
import type { BlogRepository } from "../../domain/repositories/blog.repository.interface";
import type { UpdateBlogInput } from "./blog.use-case.interface";
import {
  asInputValidationError,
  BlogInputValidationError,
  BlogNotFoundException,
} from "./blog.exceptions";
import {
  hasUpdateFields,
  normalizeBlogId,
  requireStringField,
} from "./blog.helpers";

export class UpdateBlogUseCase {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(
    id: string | number,
    input: UpdateBlogInput,
  ): Promise<BlogEntity> {
    const normalizedId = normalizeBlogId(id);

    if (!input || typeof input !== "object" || !hasUpdateFields(input)) {
      throw new BlogInputValidationError(
        "At least one blog field must be provided",
      );
    }

    const existingBlog = await this.blogRepository.getById(normalizedId);
    if (!existingBlog) {
      throw new BlogNotFoundException(normalizedId);
    }

    try {
      if (input.title !== undefined) {
        existingBlog.updateTitle(
          requireStringField(input.title, "title"),
        );
      }

      if (input.image !== undefined) {
        existingBlog.updateImage(input.image ?? undefined);
      }

      if (input.bannerImg !== undefined) {
        existingBlog.updateBannerImg(
          requireStringField(input.bannerImg, "bannerImg"),
        );
      }

      if (input.author !== undefined) {
        existingBlog.updateAuthor(
          requireStringField(input.author, "author"),
        );
      }

      if (input.authorImg !== undefined) {
        existingBlog.updateAuthorImg(
          requireStringField(input.authorImg, "authorImg"),
        );
      }

      if (input.content !== undefined) {
        existingBlog.updateContent(
          requireStringField(input.content, "content"),
        );
      }
    } catch (error) {
      throw asInputValidationError(error);
    }

    return this.blogRepository.update(normalizedId, existingBlog);
  }
}
