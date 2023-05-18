import { BloodGroup } from '../enum/bloodGroup.enum';
import { Role } from '../enum/role.enum';

export interface UserInterface {
  id: number;
  isAdmin: boolean;
  role: Role;
  bloodGroup: BloodGroup;
  bloodApproval: boolean;
}

export interface DonerPaginateInterface {
  doners: any[];
  count: number;
}
