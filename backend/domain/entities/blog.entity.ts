// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { requireNonEmpty } from "../../utils/validation";

interface BlogProps {
  id: number;
  title: string;
  image?: string;
  bannerImg: string;
  author: string;
  authorImg: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogProps {
  title: string;
  image?: string | null;
  bannerImg: string;
  author: string;
  authorImg: string;
  content: string;
}

export class BlogEntity {
  private constructor(
    private readonly _id: number,
    private _title: string,
    private _image: string | undefined,
    private _bannerImg: string,
    private _author: string,
    private _authorImg: string,
    private _content: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Tạo Blog mới. Validate tất cả các trường bắt buộc.
   * - title:        bắt buộc, không rỗng sau trim
   * - bannerImg:    bắt buộc, không rỗng sau trim
   * - author:       bắt buộc, không rỗng sau trim
   * - authorImg:    bắt buộc, không rỗng sau trim
   * - content:      bắt buộc, không rỗng sau trim
   * - image:        optional (undefined OK)
   * @throws nếu trường bắt buộc rỗng / undefined
   */
  static create(props: CreateBlogProps): BlogEntity {
    const now = new Date();
    return new BlogEntity(0,
      BlogEntity.validateTitle(props.title),
      BlogEntity.normalizeOptionalImage(props.image),
      requireNonEmpty(props.bannerImg, "bannerImg"),
      requireNonEmpty(props.author, "author"),
      requireNonEmpty(props.authorImg, "authorImg"),
      BlogEntity.validateContent(props.content),
      now,
      now
    );
  }

  /**
   * Tái tạo entity từ persistence layer (DB). KHÔNG validate lại
   * vì dữ liệu đã được persist - việc validate xảy ra ở lúc create/update.
   * Nếu DB có giá trị rỗng (data cũ) thì vẫn lưu trung thực để tránh mất dữ liệu.
   */
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

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
  get image(): string | undefined {
    return this._image;
  }
  get bannerImg(): string {
    return this._bannerImg;
  }
  get author(): string {
    return this._author;
  }
  get authorImg(): string {
    return this._authorImg;
  }
  get content(): string {
    return this._content;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  updateTitle(title: string): void {
    this._title = BlogEntity.validateTitle(title);
    this._updatedAt = new Date();
  }

  updateContent(content: string): void {
    this._content = BlogEntity.validateContent(content);
    this._updatedAt = new Date();
  }

  updateImage(image: string | undefined): void {
    this._image = BlogEntity.normalizeOptionalImage(image);
    this._updatedAt = new Date();
  }

  updateBannerImg(bannerImg: string): void {
    this._bannerImg = requireNonEmpty(bannerImg, "bannerImg");
    this._updatedAt = new Date();
  }

  updateAuthor(author: string): void {
    this._author = requireNonEmpty(author, "author");
    this._updatedAt = new Date();
  }

  updateAuthorImg(authorImg: string): void {
    this._authorImg = requireNonEmpty(authorImg, "authorImg");
    this._updatedAt = new Date();
  }

  // ===== Internal validators (private static) =====
  private static validateTitle(title: string | undefined | null): string {
    const trimmed = title?.trim();
    if (!trimmed) {
      throw new Error("Blog title cannot be empty");
    }
    return trimmed;
  }

  private static validateContent(content: string | undefined | null): string {
    const trimmed = content?.trim();
    if (!trimmed) {
      throw new Error("Blog content cannot be empty");
    }
    return trimmed;
  }

  /**
   * image là optional. Chuẩn hoá: nếu input là rỗng/whitespace -> undefined.
   * Ngược lại trả về giá trị đã trim.
   */
  private static normalizeOptionalImage(
    image: string | undefined | null
  ): string | undefined {
    if (image === undefined || image === null) return undefined;
    const trimmed = image.trim();
    return trimmed ? trimmed : undefined;
  }
}

