import { UserType } from '../enums/user-type';

export interface UserData {
  _id: string;
  email: string;
  password: string;
  type: UserType;
}

export class User {
  public _id: string;
  public email: string;
  public password: string;
  public type: UserType;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: UserData) {
    const { _id, email, password, type } = data;

    this._id = _id;
    this.email = email;
    this.password = password;
    this.type = type;

    const currentDate = new Date();

    this.createdAt = currentDate;
    this.updatedAt = currentDate;
  }

  public static fromValues(data: any) {
    return new User({ ...data });
  }
}
