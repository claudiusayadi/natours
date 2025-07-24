import { UserRole } from '../enums/user-role.enum';

export interface Payload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  role: UserRole;
}
