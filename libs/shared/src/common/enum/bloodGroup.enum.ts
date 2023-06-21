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
  valuesMap: {
    A_POS: {
      description: BloodGroup.A_POS,
    },
    A_NEG: {
      description: BloodGroup.A_NEG,
    },
    B_POS: {
      description: BloodGroup.B_POS,
    },
    B_NEG: {
      description: BloodGroup.B_NEG,
    },
    AB_POS: {
      description: BloodGroup.AB_POS,
    },
    AB_NEG: {
      description: BloodGroup.AB_NEG,
    },
    O_POS: {
      description: BloodGroup.O_POS,
    },
    O_NEG: {
      description: BloodGroup.O_NEG,
    },
    DONT_KNOW: {
      description: BloodGroup.DONT_KNOW,
    },
  },
});
