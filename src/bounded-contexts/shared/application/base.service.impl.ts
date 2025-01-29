import { Criteria } from '../domain/criteria/criteria';
import { PaginatorResponse } from '../domain/interfaces/paginator-response';
import { BaseRepository } from '../domain/repositories/base.repository';
import { BaseService } from '../domain/services/base.service';

export class BaseServiceImpl<T, R extends BaseRepository<T>> implements BaseService<T> {
  constructor(protected readonly repository: R) {}

  async create(data: any): Promise<void> {
    await this.repository.save(data);
  }

  async update(data: any): Promise<void> {
    await this.repository.update(data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getById(id: string): Promise<T | null | undefined> {
    return await this.repository.findById(id);
  }

  async getAlls(user?: string): Promise<T[]> {
    return await this.repository.findAll(user);
  }

  async matching(criteria: Criteria): Promise<PaginatorResponse<T>> {
    return await this.repository.matching(criteria);
  }
}
