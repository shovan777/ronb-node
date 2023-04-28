import { BloodRequest } from '@app/shared/entities/blood-bank.entity';

//TODO:Return the number of donation a user has done 
export const getTotalBloodDonated = async (user: any, service: any) => {
  if (user.profile?.blood_group_approval) {
    return 999;
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
