import { Criteria } from '../criteria/criteria';
import { PaginatorResponse } from '../interfaces/paginator-response';

export interface BaseService<T> {
  create(data: any): Promise<void>;
  update(data: any): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<T | undefined | null>;
  getAlls(user?: string): Promise<T[]>;
  matching(criteria: Criteria): Promise<PaginatorResponse<T>>;
}
