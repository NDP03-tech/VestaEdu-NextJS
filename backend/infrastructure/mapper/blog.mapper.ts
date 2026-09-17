import { BlogEntity } from "../../domain/entities";
import { Blog } from "../persistence/Blog";

export class BlogMapper {
  static toDomain(ormEnity: Blog): BlogEntity {
    return BlogEntity.reconstitute({
      id: ormEnity.id,
      title: ormEnity.title,
      image: ormEnity.image ?? undefined,
      bannerImg: ormEnity.bannerImg,
      author: ormEnity.author,
      authorImg: ormEnity.authorImg,
      content: ormEnity.content,
      createdAt: ormEnity.createdAt,
      updatedAt: ormEnity.updatedAt,
    });
  }

  static toPersistence(blog: BlogEntity): Blog {
    const orm = new Blog();
    orm.id = blog.id;
    orm.title = blog.title;
    orm.image = blog.image ?? null;
    orm.bannerImg = blog.bannerImg;
    orm.author = blog.author;
    orm.authorImg = blog.authorImg;
    orm.content = blog.content;
    orm.createdAt = blog.createdAt;
    orm.updatedAt = blog.updatedAt;
    return orm;
  }
}
