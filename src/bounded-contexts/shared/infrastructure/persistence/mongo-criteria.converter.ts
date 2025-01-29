import { Criteria } from '../../domain/criteria/criteria';
import { Filter } from '../../domain/criteria/filter';
import { Filters } from '../../domain/criteria/filters';
import { Operator } from '../../domain/criteria/operator';
import { Order } from '../../domain/criteria/order';
import { OrderType } from '../../domain/criteria/order-type';

type MongoFilterOperator = '$eq' | '$ne' | '$gt' | '$lt' | '$regex';
type MongoFilterValue = boolean | string | number;
type MongoFilterOperation = { [operator in MongoFilterOperator]?: MongoFilterValue };
type MongoFilter = { [field: string]: MongoFilterOperation } | { [field: string]: { $not: MongoFilterOperation } };
type MongoDirection = 1 | -1;
type MongoSort = { [field: string]: MongoDirection };

interface MongoQuery {
  filter: MongoFilter;
  sort: MongoSort;
  skip: number;
  limit: number;
}

interface TransformerFunction<T, K> {
  (value: T): K;
}

export class MongoCriteriaConverter {
  private filterTransformers: Map<Operator, TransformerFunction<Filter, MongoFilter>>;

  constructor() {
    this.filterTransformers = new Map<Operator, TransformerFunction<Filter, MongoFilter>>([
      [Operator.EQUAL, this.equalFilter],
      [Operator.NOT_EQUAL, this.notEqualFilter],
      [Operator.GT, this.greaterThanFilter],
      [Operator.LT, this.lowerThanFilter],
      [Operator.CONTAINS, this.containsFilter],
      [Operator.NOT_CONTAINS, this.notContainsFilter],
    ]);
  }

  public convert(criteria: Criteria): MongoQuery {
    return {
      filter: criteria.hasFilters() ? this.generateFilter(criteria.filters) : {},
      sort: criteria.order.hasOrder() ? this.generateSort(criteria.order) : { _id: -1 },
      skip: criteria.offset || 0,
      limit: criteria.limit || 0,
    };
  }

  protected generateFilter(filters: Filters): MongoFilter {
    const filter = filters.filters.map(filter => {
      const transformer = this.filterTransformers.get(filter.operator);

      if (!transformer) {
        throw Error(`Unexpected operator value ${filter.operator}`);
      }

      return transformer(filter);
    });

    return Object.assign({}, ...filter);
  }

  protected generateSort(order: Order): MongoSort {
    return {
      [order.orderBy === 'id' ? '_id' : order.orderBy]: order.orderType === OrderType.ASC ? 1 : -1,
    };
  }

  private equalFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $eq: filter.value } };
  }

  private notEqualFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $ne: filter.value } };
  }

  private greaterThanFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $gt: filter.value } };
  }

  private lowerThanFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $lt: filter.value } };
  }

  private containsFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $regex: filter.value } };
  }

  private notContainsFilter(filter: Filter): MongoFilter {
    return { [filter.field]: { $not: { $regex: filter.value } } };
  }
}
