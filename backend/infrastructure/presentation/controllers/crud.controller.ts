export interface HttpRequest {
  body?: unknown;
  params: Record<string, string | undefined>;
  query: Record<string, unknown>;
  user?: unknown;
}

export interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): void;
  setHeader?(name: string, value: string): HttpResponse;
}

export type NextFunction = (error?: unknown) => void;

export interface ExecutableUseCase<Input = unknown, Output = unknown> {
  execute(input: Input): Promise<Output>;
}

export interface UpdateExecutableUseCase<Output = unknown> {
  execute(id: string, input: unknown): Promise<Output>;
}

export interface CrudControllerUseCases {
  create: ExecutableUseCase<unknown>;
  getAll: ExecutableUseCase<void>;
  getById: ExecutableUseCase<string | number>;
  update: UpdateExecutableUseCase;
  remove: ExecutableUseCase<string | number>;
}

function serialize(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => serialize(item));
  if (typeof value === "object" && "toJSON" in value) {
    return (value as { toJSON: () => unknown }).toJSON();
  }
  return value;
}

function statusCodeFor(error: unknown): number {
  if (typeof error !== "object" || error === null) return 500;
  const candidate = error as { statusCode?: number; name?: string };
  if (candidate.statusCode) return candidate.statusCode;
  if (candidate.name?.includes("NotFound")) return 404;
  if (candidate.name?.includes("Input")) return 400;
  return 500;
}

export class CrudController {
  constructor(private readonly useCases: CrudControllerUseCases) {}

  create = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    await this.run(response, next, async () => {
      const result = await this.useCases.create.execute(request.body);
      response.status(201).json({ data: serialize(result) });
    });
  };

  getAll = async (
    _request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    await this.run(response, next, async () => {
      const result = await this.useCases.getAll.execute(undefined);
      response.status(200).json({ data: serialize(result) });
    });
  };

  getById = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    await this.run(response, next, async () => {
      const result = await this.useCases.getById.execute(
        request.params.id ?? "",
      );
      if (result === null || result === undefined) {
        response.status(404).json({ message: "Resource not found" });
        return;
      }
      response.status(200).json({ data: serialize(result) });
    });
  };

  update = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    await this.run(response, next, async () => {
      const result = await this.useCases.update.execute(
        request.params.id ?? "",
        request.body,
      );
      response.status(200).json({ data: serialize(result) });
    });
  };

  remove = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    await this.run(response, next, async () => {
      await this.useCases.remove.execute(request.params.id ?? "");
      response.status(204).json(null);
    });
  };

  private async run(
    response: HttpResponse,
    next: NextFunction,
    action: () => Promise<void>,
  ): Promise<void> {
    try {
      await action();
    } catch (error) {
      if (statusCodeFor(error) === 500) {
        next(error);
        return;
      }
      response.status(statusCodeFor(error)).json({
        message: error instanceof Error ? error.message : "Request failed",
      });
    }
  }
}
