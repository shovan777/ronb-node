import { calculateUserAge } from 'src/common/utils/calculateUserAge';
import { Author } from './entitiy/users.entity';

export const getAuthor = async (service, id: number): Promise<Author> => {
  return service.findOne(id).then((user) => {
    if (user) {
      const userAge: number = calculateUserAge(user.profile?.date_of_birth);
      const author: Author = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        username: user.username,
        profile: {
          id: user.profile?.id,
          age: userAge,
          bloodGroup: user.profile?.blood_group,
          bloodGroupApproval: user.profile?.blood_group_approval,
          dateOfBirth: user.profile?.date_of_birth,
          image: user.profile?.image,
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
