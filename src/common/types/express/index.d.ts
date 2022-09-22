import { User as User_, Role } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      isPublic: boolean;
      user_: User_;
      isRole: (roles: Role[]) => boolean;
    }
  }
}
