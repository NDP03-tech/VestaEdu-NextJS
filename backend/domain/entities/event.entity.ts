// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)
import { requireNonEmpty } from "../../utils/validation";

interface EventProps {
  id: number;
  image: string;
  bannerImg: string;
  date: string;
  startTime: string;
  category: string;
  title: string;
  location: string;
  cost: string;
  host: string;
  content: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateEventProps {
  image: string;
  bannerImg: string;
  date: string;
  startTime: string;
  category: string;
  title: string;
  location: string;
  cost: string;
  host: string;
  content: string;
  phone: string;
}

export class EventEntity {
  private constructor(
    private readonly _id: number,
    private _image: string,
    private _bannerImg: string,
    private _date: string,
    private _startTime: string,
    private _category: string,
    private _title: string,
    private _location: string,
    private _cost: string,
    private _host: string,
    private _content: string,
    private _phone: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(props: CreateEventProps): EventEntity {
    const now = new Date();
    return new EventEntity(0,
      requireNonEmpty(props.image, "image"),
      requireNonEmpty(props.bannerImg, "bannerImg"),
      requireNonEmpty(props.date, "date"),
      requireNonEmpty(props.startTime, "startTime"),
      requireNonEmpty(props.category, "category"),
      requireNonEmpty(props.title, "title"),
      requireNonEmpty(props.location, "location"),
      requireNonEmpty(props.cost, "cost"),
      requireNonEmpty(props.host, "host"),
      requireNonEmpty(props.content, "content"),
      requireNonEmpty(props.phone, "phone"),
      now,
      now
    );
  }

  static reconstitute(props: EventProps): EventEntity {
    return new EventEntity(
      props.id,
      props.image,
      props.bannerImg,
      props.date,
      props.startTime,
      props.category,
      props.title,
      props.location,
      props.cost,
      props.host,
      props.content,
      props.phone,
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
  get bannerImg(): string {
    return this._bannerImg;
  }
  get date(): string {
    return this._date;
  }
  get startTime(): string {
    return this._startTime;
  }
  get category(): string {
    return this._category;
  }
  get title(): string {
    return this._title;
  }
  get location(): string {
    return this._location;
  }
  get cost(): string {
    return this._cost;
  }
  get host(): string {
    return this._host;
  }
  get content(): string {
    return this._content;
  }
  get phone(): string {
    return this._phone;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ===== Business methods =====
  updateBasicInfo(props: {
    title?: string;
    date?: string;
    startTime?: string;
    category?: string;
    location?: string;
    cost?: string;
    host?: string;
    content?: string;
    phone?: string;
  }): void {
    if (props.title !== undefined)
      this._title = requireNonEmpty(props.title, "title");
    if (props.date !== undefined)
      this._date = requireNonEmpty(props.date, "date");
    if (props.startTime !== undefined)
      this._startTime = requireNonEmpty(
        props.startTime,
        "startTime"
      );
    if (props.category !== undefined)
      this._category = requireNonEmpty(props.category, "category");
    if (props.location !== undefined)
      this._location = requireNonEmpty(
        props.location,
        "location"
      );
    if (props.cost !== undefined)
      this._cost = requireNonEmpty(props.cost, "cost");
    if (props.host !== undefined)
      this._host = requireNonEmpty(props.host, "host");
    if (props.content !== undefined)
      this._content = requireNonEmpty(props.content, "content");
    if (props.phone !== undefined)
      this._phone = requireNonEmpty(props.phone, "phone");
    this._updatedAt = new Date();
  }

  setImage(image: string): void {
    this._image = requireNonEmpty(image, "image");
    this._updatedAt = new Date();
  }

  setBannerImg(banner: string): void {
    this._bannerImg = requireNonEmpty(banner, "bannerImg");
    this._updatedAt = new Date();
  }
}
