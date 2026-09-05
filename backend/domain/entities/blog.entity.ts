import { randomUUID } from "crypto";
interface BlogProps {
  id: string;
  title: string;
  image?: string;
  bannerImg: string;
  author: string;
  authorImg: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateBlogProps {
  title: string;
  image?: string;
  bannerImg: string;
  author: string;
  authorImg: string;
  content: string;
}

export class BlogEntity {
  private constructor(
    private readonly _id: string,
    private _title: string,
    private _image: string | undefined,
    private _bannerImg: string,
    private _author: string,
    private _authorImg: string,
    private _content: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateBlogProps): BlogEntity {
    return new BlogEntity(
      randomUUID(),
      props.title,
      props.image,
      props.bannerImg,
      props.author,
      props.authorImg,
      props.content,
      new Date(),
      new Date()
    );
  }

  static reconstitute(props: BlogProps): BlogEntity {
    return new BlogEntity(
      props.id,
      props.title,
      props.image,
      props.bannerImg,
      props.author,
      props.authorImg,
      props.content,
      props.createdAt,
      props.updatedAt
    );
  }

  updateTitle(title: string): void {
    const trimmed = title?.trim();
    if (!trimmed) {
      throw new Error("Blog title cannot be empty");
    }
    this._title = trimmed;
    this._updatedAt = new Date();
  }

  updateContent(content: string): void {
    const trimmed = content.trim();
    if (!trimmed) throw new Error("Content must be fill");
    this._content = content;
    this._updatedAt = new Date();
  }

  updateImage(image: string | undefined): void {
    this._image = image;
    this._updatedAt = new Date();
  }

  
}
