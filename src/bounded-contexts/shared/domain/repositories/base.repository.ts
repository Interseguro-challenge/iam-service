import { Criteria } from '../criteria/criteria';
import { PaginatorResponse } from '../interfaces/paginator-response';

export interface BaseRepository<T> {
  save(data: T): Promise<void>;
  saveMany(data: T[]): Promise<void>;
  updateMany(data: T[]): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
  update(data: T): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | undefined | null>;
  findAll(user?: string): Promise<T[]>;
  matching(criteria: Criteria): Promise<PaginatorResponse<T>>;
}
