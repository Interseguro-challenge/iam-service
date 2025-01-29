import { Request } from 'express';

export const hasQueryParameters = (req: Request): boolean => {
  return Object.keys(req.query).length > 0;
};
