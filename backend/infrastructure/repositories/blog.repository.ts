// infrastructure/repositories/blog.repository.impl.ts
import { Repository } from "typeorm";
import { BlogRepository } from "../../domain/repositories/blog.repository.interface";
import { BlogEntity } from "../../domain/entities";
import { Blog } from "../persistence/Blog";
import { BlogMapper } from "../mapper/blog.mapper";

export class BlogRepositoryImpl implements BlogRepository {
  constructor(private readonly repo: Repository<Blog>) {}

  async getById(id: number): Promise<BlogEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? BlogMapper.toDomain(orm) : null;
  }

  async getAll(): Promise<BlogEntity[]> {
    const list = await this.repo.find({ order: { createdAt: "DESC" } });
    return list.map(BlogMapper.toDomain);
  }

  async create(blog: BlogEntity): Promise<BlogEntity> {
    const orm = BlogMapper.toPersistence(blog);
    const saved = await this.repo.save(orm);
    return BlogMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async update(id: number, blog: BlogEntity): Promise<BlogEntity> {
    const orm = BlogMapper.toPersistence(blog);
    orm.id = id;
    const saved = await this.repo.save(orm);
    return BlogMapper.toDomain(saved);
  }
}
