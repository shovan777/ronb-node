import { BloodRequest } from '@app/shared/entities/blood-bank.entity';

export const getTotalBloodDonated = async (user: any, service: any) => {
  if (user.profile?.blood_group_approval) {
    let donorsList = [];

    const bloodRequest: BloodRequest[] = await service.find();
    bloodRequest.forEach((each) => {
      donorsList = [...donorsList, ...each.doners];
    });

    let count = donorsList.reduce((acc, val) => {
      if (val == user.id) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    return count;
  } else {
    return 0;
  }
};

export const getTotalBloodAccepted = async (user: any, service: any) => {
  if (user.profile?.blood_group_approval) {
    let acceptorsList = [];

    const bloodRequest: BloodRequest[] = await service.find();
    bloodRequest.forEach((each) => {
      acceptorsList = [...acceptorsList, ...each.acceptors];
    });

    let count = acceptorsList.reduce((acc, val) => {
      if (val == user.id) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    return count;
  } else {
    return 0;
  }
};
