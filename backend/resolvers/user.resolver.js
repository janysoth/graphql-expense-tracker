import { users } from '../dummyData/data.js';

const userResolver = {
  Query: {
    users: () => {
      return users;
    }
  },
  // Mutations: {}
};

export default userResolver;