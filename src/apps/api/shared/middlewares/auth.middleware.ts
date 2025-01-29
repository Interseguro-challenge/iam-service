import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../../bounded-contexts/shared/infrastructure/adapters/jwt.adapter';
import { UserModel } from '../../../../bounded-contexts/users/infrastructure/persistense/mongodb/models/user.model';

export class AuthMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization');

    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization?.startsWith('Bearer')) return res.status(401).json({ error: 'Invalid bearer token' });

    const token = authorization?.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ _id: string }>(token);

      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await UserModel.findById(payload._id);
      if (!user) return res.status(401).json({ error: 'Invalid token - User not found' });

      req.body.user = user.toObject();

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
