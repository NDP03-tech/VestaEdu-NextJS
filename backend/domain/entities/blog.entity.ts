import { randomUUID } from "crypto";
export class BlogEntity {
    constructor(
        public id: number,
        public title: string,
        public image: string,
        public bannerImg: string,
        public author: string,
        public authorImg: string,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}

    static create(blog: Partial<BlogEntity>): BlogEntity {
        return new BlogEntity(
            randomUUID(blog.id),
            blog.title || undefined,
            image?:blog.image || undefined,
            bannerImg?:blog.bannerImg || undefined,
            author?:blog.author || undefined,
            authorImg?:blog.authorImg || undefined,
            content?:blog.content || undefined,
            createdAt?:blog.createdAt || new Date(),
            updatedAt?:blog.updatedAt || new Date(),
        );
} }