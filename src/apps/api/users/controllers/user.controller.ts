import { Request, Response } from 'express';
import { UserRepositoryImpl } from '../../../../bounded-contexts/users/infrastructure/persistense/mongodb/repositories/user.repository.impl';
import { HTTP_STATUS } from '../../shared/constants/http-codes';
import { handleError } from '../../shared/utils/handle.error';
import { LoginUserUseCase } from '../../../../bounded-contexts/users/application/login-user.use-case';
import { RegisterUserUseCase } from '../../../../bounded-contexts/users/application/register-user.use-case';

export class UserController {
  private readonly userRepository: UserRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  login = (req: Request, res: Response) => {
    new LoginUserUseCase(this.userRepository)
      .execute(req.body)
      .then(data => res.status(HTTP_STATUS.OK).send(data))
      .catch(error => handleError(error, res));
  };

  register = (req: Request, res: Response) => {
    new RegisterUserUseCase(this.userRepository)
      .execute(req.body)
      .then(() => res.status(HTTP_STATUS.CREATED).send())
      .catch(error => handleError(error, res));
  };
}
