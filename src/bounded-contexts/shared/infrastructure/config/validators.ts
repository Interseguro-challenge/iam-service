import mongoose from 'mongoose';
import validate from 'uuid-validate';
import { UserType } from '../../../users/domain/enums/user-type';

export class Validators {
  static get email() {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  }

  static validUuid(id: string): boolean {
    return validate(id);
  }

  static validRol(role: string): boolean {
    return Object.values(UserType).filter(validRole => validRole === role).length > 0;
  }
}
