import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth/auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers/resolvers.js";
import { PrismaClient, Prisma } from "@prisma/client";

// Create a new instance of PrismaClient to use as the database client
export const prisma = new PrismaClient();

// Configuration for env file for the server
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

// Create a new instance of express to use as the server
const app = express();
app.use(cors(), express.json(), authMiddleware);

// Create a new route for the login endpoint
app.post("/login", handleLogin);

// Create a new instance typeDefs from the schema file
const typeDefs = await readFile("./schema/schema.graphql", "utf-8");

// Create a new instance of ApolloServer
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

// Creating a context function to pass the user and prisma to the resolvers
function getContext({ req }) {
  const context = { prisma };
  if (req.auth) {
    context.user = req.auth;
  }
  return context;
}

// Create a new route for the graphql endpoint
app.use(
  "/graphql",
  apolloMiddleware(apolloServer, {
    context: getContext,
  })
);

// Start the server on the specified port
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql endpoint: http://localhost:${PORT}/graphql`);
});
