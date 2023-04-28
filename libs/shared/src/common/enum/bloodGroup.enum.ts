import { registerEnumType } from '@nestjs/graphql';

export enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
  DONT_KNOW = "Don't Know",
}

registerEnumType(BloodGroup, {
  name: 'BloodGroup',
});
