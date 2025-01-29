import { UserType } from "../../domain/enums/user-type";

export class RegisterUserDto {
  constructor(public id: string, public email: string, public password: string, public type: UserType) {}
}
