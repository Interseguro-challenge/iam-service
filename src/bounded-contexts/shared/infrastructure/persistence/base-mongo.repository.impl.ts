import { Criteria } from '../../domain/criteria/criteria';
import { CustomError } from '../../domain/errors/custom.error';
import { BaseRepository } from '../../domain/repositories/base.repository';
import { MongoCriteriaConverter } from './mongo-criteria.converter';
import { BaseEntity } from '../../domain/entities/base.entity';
import { PaginatorResponse } from '../../domain/interfaces/paginator-response';
import { Filter } from '../../domain/criteria/filter';
import mongoose from 'mongoose';
import { BaseDocument } from './base.document';

export abstract class BaseMongoRepositoryImpl<T extends BaseEntity, D extends BaseDocument>
  implements BaseRepository<T>
{
  private criteriaConverter: MongoCriteriaConverter;
  protected readonly model: mongoose.Model<D>;
  protected readonly fieldsToPopulate: string;

  constructor(model: any, fieldsToPopulate: Array<string> = []) {
    this.criteriaConverter = new MongoCriteriaConverter();
    this.model = model;
    this.fieldsToPopulate = this.joinFields(fieldsToPopulate);
  }

  protected abstract createFromValues(values: any): T;

  deleteMany(ids: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.model
        .deleteMany({ _id: { $in: ids } as any })
        .then(() => resolve())
        .catch(error =>
          reject(CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`))
        );
    });
  }

  updateMany(data: T[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const bulkOps: any[] = data.map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: { ...item },
          upsert: false,
        },
      }));

      this.model
        .bulkWrite(bulkOps)
        .then(() => resolve())
        .catch(error =>
          reject(CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`))
        );
    });
  }

  async saveMany(data: T[]): Promise<void> {
    try {
      await this.model.insertMany(data);
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.model.findOne({ _id: id } as any);
      if (!existing) throw CustomError.notFound('Not found');
      await existing.deleteOne();
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async save(data: T): Promise<void> {
    try {
      await this.model.create(data);
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async update(data: T): Promise<void> {
    try {
      const existing = await this.model.findOne({ _id: data._id } as any);
      if (!existing) throw CustomError.notFound(`<${this.constructor.name}> not found`);
      await existing.updateOne({ ...data });
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async findById(id: string): Promise<T | null | undefined> {
    try {
      const document = await this.model.findOne({ _id: id } as any).populate(this.fieldsToPopulate);
      return this.createFromValues(document?.toJSON());
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async findAll(user?: string): Promise<T[]> {
    try {
      const query = user ? { user } : null;

      const documents = await this.model.find(query as any).populate(this.fieldsToPopulate);

      return documents.map((document: any) => this.createFromValues(document?.toJSON()));
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async matching(criteria: Criteria): Promise<PaginatorResponse<T>> {
    try {
      const query = this.criteriaConverter.convert(criteria);
      const documents = await this.model
        .find(query.filter as any)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .populate(this.fieldsToPopulate);

      const data = documents.map((document: any) => this.createFromValues(document?.toJSON()));

      const totalLength = await this.model.countDocuments(query.filter as any);

      return {
        data,
        length: totalLength,
        pageIndex: Math.floor(query.skip / query.limit),
        pageSize: query.limit,
      };
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  private joinFields(fields: string[]): string {
    return fields.join(' ');
  }

  private replaceFieldWithUnderscoreId(filters: Filter[]): Filter[] {
    return filters.map(filter => {
      if (filter.field === 'id') {
        return { ...filter, field: '_id' };
      }
      return filter;
    });
  }
}
