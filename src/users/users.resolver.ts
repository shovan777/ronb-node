import { Author } from './entitiy/users.entity';

export const getAuthor = async (service, id: number): Promise<Author> => {
  return service.findOne(id).then((user) => {
    if (user) {
      const author: Author = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        profile: {
          id: user.profile?.id,
          bloodGroup: user.profile?.bloodGroup,
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
