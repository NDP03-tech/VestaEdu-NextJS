export type BlogId = string | number;

export interface CreateBlogInput {
  title: string;
  image?: string | null;
  bannerImg: string;
  author: string;
  authorImg: string;
  content: string;
}

export interface UpdateBlogInput {
  title?: string | null;
  image?: string | null;
  bannerImg?: string | null;
  author?: string | null;
  authorImg?: string | null;
  content?: string | null;
}
