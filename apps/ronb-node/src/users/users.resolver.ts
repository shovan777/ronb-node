import { DonerPaginateInterface } from '@app/shared/common/interfaces/user.interface';
import {
  getTotalBloodAccepted,
  getTotalBloodDonated,
} from '@app/shared/common/utils/bloodDonationRecord';
import { calculateUserAge } from '@app/shared/common/utils/calculateUserAge';
import { Author } from '@app/shared/entities/users.entity';

export const getAuthor = async (service, id: number): Promise<Author> => {
  return service.findOne(id).then((user) => {
    if (user) {
      const userAge: number = calculateUserAge(user.profile?.date_of_birth);
      const author: Author = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        address: {
          province: user.province,
          district: user.district,
        },
        profile: {
          id: user.profile?.id,
          age: userAge,
          bloodGroup: user.profile?.blood_group,
          bloodGroupApproval: user.profile?.blood_group_approval,
          dateOfBirth: user.profile?.date_of_birth,
          bloodProfileNumber: user.profile?.blood_number,
        },
      };
      return author;
    }
    return {
      id: -1,
      name: 'Account Deleted',
    };
  });
};

export const getDoners = async (
  limit: number,
  offset: number,
  service: any,
  bloodService: any,
): Promise<DonerPaginateInterface> => {
  const paginatedDoners: DonerPaginateInterface = await service.findAllDoners(
    limit,
    offset,
  );
  const { doners, count } = paginatedDoners;
  let authors: Author[] = [];
  if (doners) {
    await Promise.all(
      doners.map(async (user: any) => {
        const userAge: number = calculateUserAge(user.profile?.date_of_birth);
        const totalAccepted: number = await getTotalBloodAccepted(
          user,
          bloodService,
        );
        const totalDonation: number = await getTotalBloodDonated(
          user,
          bloodService,
        );
        authors.push({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          address: {
            province: user.province,
            district: user.district,
          },
          profile: {
            id: user.profile?.id,
            age: userAge,
            bloodGroup: user.profile?.blood_group,
            bloodGroupApproval: user.profile?.blood_group_approval,
            dateOfBirth: user.profile?.date_of_birth,
            bloodProfileNumber: user.profile?.blood_number,
            totalDonation: totalDonation,
            totalAccepted: totalAccepted,
          },
        });
      }),
    );
    return { doners: authors, count: count };
  }
};
