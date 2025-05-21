// types.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role?: string;
        producerId?: string;
      };
    }
  }
}