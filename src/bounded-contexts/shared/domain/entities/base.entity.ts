export interface BaseEntityData {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BaseEntity {
  public _id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: BaseEntityData) {
    const { _id, createdAt, updatedAt } = data;

    const date = new Date();

    this._id = _id;
    this.createdAt = createdAt ? createdAt : date;
    this.updatedAt = updatedAt ? updatedAt : date;
  }
}
