import { Role } from '../enum/role.enum';

export interface UserInterface {
  id: number;
  isAdmin: boolean;
  role: Role;
}

export interface DonerPaginateInterface {
  doners: any[];
  count: number;
}
