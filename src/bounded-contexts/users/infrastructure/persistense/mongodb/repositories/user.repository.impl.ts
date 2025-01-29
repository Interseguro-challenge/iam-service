import { CustomError } from '../../../../../shared/domain/errors/custom.error';
import { BcryptAdapter } from '../../../../../shared/infrastructure/adapters/bcrypt.adapter';
import { User } from '../../../../domain/entities/user';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { UserModel } from '../models/user.model';

type CompareFunction = (password: string, hashed: string) => boolean;

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly comparePassword: CompareFunction = BcryptAdapter.compare) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await UserModel.findOne({ email });
      if (!document) return null;
      return new User(document.toJSON());
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const exists = await this.findByEmail(email);
      return !!exists;
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }

  async save(user: User): Promise<void> {
    try {
      await UserModel.create(user);
    } catch (error) {
      throw CustomError.internalServerError(`<${this.constructor.name}> Internal server error: ${error}`);
    }
  }
}
