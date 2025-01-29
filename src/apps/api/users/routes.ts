import { Router } from 'express';
import { UserController } from './controllers/user.controller';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UserController();

    router.post('/register', controller.register);
    router.post('/login', controller.login);

    return router;
  }
}
