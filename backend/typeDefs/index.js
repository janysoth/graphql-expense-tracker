// This file will merge the user.typeDef.js and transaction.typeDef.js together

import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;
