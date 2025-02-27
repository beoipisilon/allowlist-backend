import { Request } from "express";
import { Session } from "express-session";
import { User } from '../auth/entities/user.entity';

declare module "express" {
  interface Request {
    isAuthenticated(): boolean;
    user?: User; // Altere para o tipo real do seu usuário, se houver
    session: Session & { user?: any }; // Garante que destroy() exista
  }
}
