
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error getting transactions: ", err);
        throw new Error("Error in getting transactions");
      }
    }, // End of transactions Query

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error in getting a transaction: ", err);
        throw new Error("Error in getting a transaction");
      }
    }, // End of transaction Query

    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
    }, // End of categoryStatistic query
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction: ", err);
        throw new Error("Error in creating transaction");
      }
    }, // End of createTransaction mutation

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });

        return updatedTransaction;
      } catch (err) {
        console.error("Error in updating transaction: ", err);
        throw new Error("Error in updating transaction");
      }
    }, // End of updateTransaction mutation

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction: ", err);
        throw new Error("Error in deleting transaction");
      }
    }, // End of deleteTransaction mutation
  },

  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user: ", err);
        throw new Error("Error getting user");
      }
    }
  }
};

export default transactionResolver;