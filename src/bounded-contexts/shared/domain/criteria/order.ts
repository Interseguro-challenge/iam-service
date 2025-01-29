import { OrderType } from './order-type';

export class Order {
  readonly orderBy: string;
  readonly orderType: OrderType;

  constructor(orderBy: string, orderType: OrderType) {
    this.orderBy = orderBy;
    this.orderType = orderType;
  }

  static fromValues(orderBy?: string, orderType?: OrderType): Order {
    if (!orderBy) return Order.none();
    if (!orderType) return Order.asc(orderBy);

    return new Order(orderBy, orderType);
  }

  static none(): Order {
    return new Order('', OrderType.NONE);
  }

  static desc(orderBy: string): Order {
    return new Order(orderBy, OrderType.DESC);
  }

  static asc(orderBy: string): Order {
    return new Order(orderBy, OrderType.ASC);
  }

  public hasOrder(): boolean {
    return this.orderType !== OrderType.NONE;
  }
}
