import { Request, Response } from 'express';
import { BaseService } from '../../../../bounded-contexts/shared/domain/services/base.service';
import { HTTP_STATUS } from '../constants/http-codes';
import { handleError } from '../utils/handle.error';
import { Filters } from '../../../../bounded-contexts/shared/domain/criteria/filters';
import { FilterType, parseFilters } from '../utils/parse-filters';
import { Order } from '../../../../bounded-contexts/shared/domain/criteria/order';
import { Criteria } from '../../../../bounded-contexts/shared/domain/criteria/criteria';
import { OrderType } from '../../../../bounded-contexts/shared/domain/criteria/order-type';
import { User } from '../../../../bounded-contexts/users/domain/entities/user';
import { UserType } from '../../../../bounded-contexts/users/domain/enums/user-type';

export abstract class BaseController<T, S extends BaseService<T>> {
  abstract service: S;

  create = (req: Request, res: Response) => {
    this.service
      .create(req.body)
      .then(() => res.status(HTTP_STATUS.CREATED).send())
      .catch(error => handleError(error, res));
  };

  update = (req: Request, res: Response) => {
    this.service
      .update(req.body)
      .then(() => res.status(HTTP_STATUS.OK).send())
      .catch(error => handleError(error, res));
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    this.service
      .delete(id)
      .then(() => res.status(HTTP_STATUS.OK).send())
      .catch(error => handleError(error, res));
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.service
      .getById(id)
      .then(data => res.status(HTTP_STATUS.OK).json(data))
      .catch(error => handleError(error, res));
  };

  getAll = (req: Request, res: Response) => {
    const userType: UserType = (req.body.user as User).type;

    this.service
      .getAlls()
      .then(data => res.status(HTTP_STATUS.OK).json(data))
      .catch(error => handleError(error, res));
  };

  search = (req: Request, res: Response) => {
    const queryParams = req.query;

    let filters!: Filters;
    queryParams.filters && (filters = Filters.fromValues(parseFilters(queryParams.filters as Array<FilterType>)));
    const order = Order.fromValues(queryParams.orderBy as string, queryParams.order as OrderType);

    const criteria = new Criteria(
      filters,
      order,
      queryParams.limit ? Number(queryParams.limit) : undefined,
      queryParams.offset ? Number(queryParams.offset) : undefined
    );

    this.service
      .matching(criteria)
      .then(data => res.status(HTTP_STATUS.OK).json(data))
      .catch(error => handleError(error, res));
  };
}
