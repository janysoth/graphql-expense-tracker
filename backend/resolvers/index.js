// This file will merge the user.resolver.js and transaction.resolver.js together

import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import transactionResolver from "./transaction.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;