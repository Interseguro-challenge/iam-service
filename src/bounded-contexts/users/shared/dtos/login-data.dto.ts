import { UserType } from '../../domain/enums/user-type';

export interface LoginData {
  token: string;
  user: {
    _id: string;
    type: UserType,
    email: string;
  };
}