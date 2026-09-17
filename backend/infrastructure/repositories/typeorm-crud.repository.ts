import { Repository } from "typeorm";

export interface EntityMapper<Domain, Orm> {
  toDomain(orm: Orm): Domain;
  toPersistence(entity: Domain): Orm;
}

export abstract class TypeOrmCrudRepository<
  Domain,
  Orm extends { id: string | number },
> {
  protected constructor(
    protected readonly repository: Repository<Orm>,
    protected readonly mapper: EntityMapper<Domain, Orm>,
  ) {}

  async create(entity: Domain): Promise<void> {
    await this.repository.save(this.mapper.toPersistence(entity));
  }

  async getById(id: string | number): Promise<Domain | null> {
    const orm = await this.repository.findOneBy({
      id: Number(id),
    } as never);
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async getAll(): Promise<Domain[]> {
    const rows = await this.repository.find();
    return rows.map((row) => this.mapper.toDomain(row));
  }

  async update(id: string | number, entity: Domain): Promise<void> {
    const orm = this.mapper.toPersistence(entity);
    await this.repository.save(orm);
  }

  async delete(id: string | number): Promise<void> {
    await this.repository.delete(Number(id));
  }
}
