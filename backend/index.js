import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();

const app = express();

const httpServer = http.createServer(app);

// Set up MongoDB store
const MongoStore = connectMongo(session);
const store = new MongoStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// To handle any error
store.on("error", (err) => console.log(err));

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // This option specifies whether to save the session to the store for every request
    resave: false,
    // This option specifies whether to save uninitialized sessions
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true, // Only HTTP requests can access cookies
    },
    store: store
  })
);

// Initialize Passport middleware
app.use(passport.initialize());

// Passport Management
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/graphql',
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server start up
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/`);