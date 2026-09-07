// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import {
  validateName,
  requireNonEmpty,
  normalizeSchedule,
  type ScheduleEntry,
} from "../../utils/validation";

interface CourseProps {
  id: number;
  image: string;
  bannerImg: string | null;
  name: string;
  author: string;
  authorImg: string | null;
  lesson: string;
  price: string;
  duration: string;
  type: string;
  language: string;
  content: string;
  title: string;
  dis: string;
  schedule: ScheduleEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCourseProps {
  image: string;
  bannerImg?: string | null;
  name: string;
  author: string;
  authorImg?: string | null;
  lesson: string;
  price: string;
  duration: string;
  type: string;
  language: string;
  content: string;
  title: string;
  dis: string;
  schedule?: ScheduleEntry[] | string;
}

export class CourseEntity {
  private constructor(
    private readonly _id: number,
    private _image: string,
    private _bannerImg: string | null,
    private _name: string,
    private _author: string,
    private _authorImg: string | null,
    private _lesson: string,
    private _price: string,
    private _duration: string,
    private _type: string,
    private _language: string,
    private _content: string,
    private _title: string,
    private _dis: string,
    private _schedule: ScheduleEntry[],
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateCourseProps): CourseEntity {
    const now = new Date();
    return new CourseEntity(0,
      requireNonEmpty(props.image, "image"),
      props.bannerImg?.trim() || null,
      validateName(props.name),
      requireNonEmpty(props.author, "author"),
      props.authorImg?.trim() || null,
      requireNonEmpty(props.lesson, "lesson"),
      requireNonEmpty(props.price, "price"),
      requireNonEmpty(props.duration, "duration"),
      requireNonEmpty(props.type, "type"),
      requireNonEmpty(props.language, "language"),
      requireNonEmpty(props.content, "content"),
      requireNonEmpty(props.title, "title"),
      requireNonEmpty(props.dis, "dis"),
      normalizeSchedule(props.schedule),
      now,
      now
    );
  }

  static reconstitute(props: CourseProps): CourseEntity {
    return new CourseEntity(
      props.id,
      props.image,
      props.bannerImg,
      props.name,
      props.author,
      props.authorImg,
      props.lesson,
      props.price,
      props.duration,
      props.type,
      props.language,
      props.content,
      props.title,
      props.dis,
      Array.isArray(props.schedule) ? props.schedule : [],
      props.createdAt,
      props.updatedAt
    );
  }

  // ===== Getters =====
  get id(): number {
    return this._id;
  }
  get image(): string {
    return this._image;
  }
  get bannerImg(): string | null {
    return this._bannerImg;
  }
  get name(): string {
    return this._name;
  }
  get author(): string {
    return this._author;
  }
  get authorImg(): string | null {
    return this._authorImg;
  }
  get lesson(): string {
    return this._lesson;
  }
  get price(): string {
    return this._price;
  }
  get duration(): string {
    return this._duration;
  }
  get type(): string {
    return this._type;
  }
  get language(): string {
    return this._language;
  }
  get content(): string {
    return this._content;
  }
  get title(): string {
    return this._title;
  }
  get dis(): string {
    return this._dis;
  }
  get schedule(): ScheduleEntry[] {
    return [...this._schedule];
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  updateBasicInfo(props: {
    name?: string;
    title?: string;
    dis?: string;
    author?: string;
    lesson?: string;
    price?: string;
    duration?: string;
    type?: string;
    language?: string;
    content?: string;
  }): void {
    if (props.name !== undefined) this._name = validateName(props.name);
    if (props.title !== undefined)
      this._title = requireNonEmpty(props.title, "title");
    if (props.dis !== undefined)
      this._dis = requireNonEmpty(props.dis, "dis");
    if (props.author !== undefined)
      this._author = requireNonEmpty(props.author, "author");
    if (props.lesson !== undefined)
      this._lesson = requireNonEmpty(props.lesson, "lesson");
    if (props.price !== undefined)
      this._price = requireNonEmpty(props.price, "price");
    if (props.duration !== undefined)
      this._duration = requireNonEmpty(props.duration, "duration");
    if (props.type !== undefined)
      this._type = requireNonEmpty(props.type, "type");
    if (props.language !== undefined)
      this._language = requireNonEmpty(props.language, "language");
    if (props.content !== undefined)
      this._content = requireNonEmpty(props.content, "content");
    this._updatedAt = new Date();
  }

  setImage(image: string | null): void {
    this._image = image ? requireNonEmpty(image, "image") : "";
    this._updatedAt = new Date();
  }

  setBannerImg(banner: string | null): void {
    this._bannerImg = banner?.trim() || null;
    this._updatedAt = new Date();
  }

  setAuthorImg(image: string | null): void {
    this._authorImg = image?.trim() || null;
    this._updatedAt = new Date();
  }

  setSchedule(schedule: ScheduleEntry[] | string): void {
    this._schedule = normalizeSchedule(schedule);
    this._updatedAt = new Date();
  }
}

