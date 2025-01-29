import { BcryptAdapter } from '../../shared/infrastructure/adapters/bcrypt.adapter';
import { UserRepository } from '../domain/repositories/user.repository';
import { LoginUserDto } from '../shared/dtos/login-user.dto';
import { CustomError } from '../../shared/domain/errors/custom.error';
import { JwtAdapter } from '../../shared/infrastructure/adapters/jwt.adapter';
import { LoginData } from '../shared/dtos/login-data.dto';
import { User } from '../domain/entities/user';

type CompareFunction = (password: string, hashed: string) => boolean;
type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(data: LoginUserDto): Promise<LoginData> {
    const { email, password } = data;

    try {
      const user = await this.userRepository.findByEmail(email);
      this.ensureUserExists(user);
      this.ensurePasswordIsValid(password, user!.password);

      const token = await this.signToken({ _id: user!._id });
      this.ensureTokenGenerated(token);

      return this.buildLoginData(user!, token!);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }
  }

  private ensureUserExists(user: User | null): void {
    if (!user) {
      throw CustomError.badRequest('Invalid credentials');
    }
  }

  private ensurePasswordIsValid(password: string, hashedPassword: string): void {
    if (!this.comparePassword(password, hashedPassword)) {
      throw CustomError.badRequest('Invalid credentials');
    }
  }

  private ensureTokenGenerated(token: string | null): void {
    if (!token) {
      throw CustomError.internalServerError('Internal server error');
    }
  }

  private buildLoginData(user: User, token: string): LoginData {
    return {
      token,
      user: {
        _id: user._id,
        type: user.type,
        email: user.email,
      },
    };
  }
}
