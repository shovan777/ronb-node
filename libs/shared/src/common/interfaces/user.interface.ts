import { Role } from '../enum/role.enum';

export interface UserInterface {
  id: number;
  isAdmin: boolean;
  role: Role;
}
