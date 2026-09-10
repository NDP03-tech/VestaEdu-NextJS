export type CategoryId = string | number;

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string | null;
}
