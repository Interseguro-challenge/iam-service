import { CustomError } from '../../shared/domain/errors/custom.error';
import { BcryptAdapter } from '../../shared/infrastructure/adapters/bcrypt.adapter';
import { RegisterUserDto } from '../shared/dtos/register-user.dto';
import { User } from '../domain/entities/user';
import { UserRepository } from '../domain/repositories/user.repository';

type HashFunction = (password: string) => string;

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPassword: HashFunction = BcryptAdapter.hash
  ) {}

  async execute(data: RegisterUserDto): Promise<void> {
    const { id, type, email, password } = data;

    try {
      const exists = await this.userRepository.emailExists(email);

      if (exists) throw CustomError.badRequest('User already exists');

      const user = new User({
        _id: id,
        type,
        email,
        password: this.hashPassword(password),
      });

      await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }
}
