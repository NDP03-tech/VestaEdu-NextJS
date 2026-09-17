import { BlogEntity } from "../entities";

export interface BlogRepository {
  create(blog: BlogEntity): Promise<BlogEntity>;
  getById(id: number): Promise<BlogEntity | null>;
  getAll(): Promise<BlogEntity[]>;
  update(id: number, blog: BlogEntity): Promise<BlogEntity>;
  delete(id: number): Promise<void>;
}

/**
 * Alias giữ tương thích với các implementation cũ đang dùng tên interface
 * viết thường. Các code mới nên dùng `BlogRepository`.
 */
export type blogRepository = BlogRepository;
