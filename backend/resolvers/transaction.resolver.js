
import Transaction from '../models/transaction.model.js';

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
  },
  Mutation: {},
};

export default transactionResolver;