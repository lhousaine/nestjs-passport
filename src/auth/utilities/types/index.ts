import { Request } from 'express';
import { User } from '../../../users/models/user';

export interface PassportRequest extends Request {
  user: User;
  logout: () => void;
  isAuthenticated: () => this is PassportRequest & { user: User };
}
