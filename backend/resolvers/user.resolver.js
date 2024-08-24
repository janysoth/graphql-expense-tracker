import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.error("Error in signUp: ", err);
        throw new Error(err.message || "Internal server error");
      }
    }, // End of signUp 

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) throw new Error("All Fields are required.");

        const { user } = await context.authenticate("graphql-local", { username, password });

        await context.login(user);
        return user;
      } catch (err) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal Server Error");
      }
    }, // End of login

    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });

        context.res.clearCookie("connect.sid");

        return { message: "Logged Out Successfully" };
      } catch (err) {
        console.error("Error in logout:", err);
        throw new Error(err.message || "Internal Server Error");
      }
    }, // End of logout
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: , err");
        throw new Error("Internal Server Error");
      }
    }, // End of authUser query

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query: ", err);
        throw new Error(err.message || "Error in getting user");
      }
    }, // End of user query
  },
  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default userResolver;