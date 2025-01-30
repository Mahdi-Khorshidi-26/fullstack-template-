import { GraphQLError } from "graphql";
import { userLoader } from "../loaders/userLoader.js";
export function customGraphQLErrorHandler(errorMessage, extensionsCode) {
  throw new GraphQLError(errorMessage, {
    extensions: {
      code: extensionsCode,
    },
  });
}

import { Query } from "./queries.js";
import { Mutation } from "./mutations.js";
export const resolvers = {
  // These are the resolvers for the queries defined in the schema
  Query,
  // These are the resolvers for the mutations defined in the schema
  Mutation,
  User: {
    // Custom resolver for the email field of the User type
    posts: (parent, _args, { user, prisma }) => {
      if (!user) {
        customGraphQLErrorHandler("User not authenticated", "UNAUTHENTICATED");
      }
      const posts = prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
      });
      return posts;
    },
    profile: (parent, _args, { user, prisma }) => {
      if (!user) {
        customGraphQLErrorHandler("User not authenticated", "UNAUTHENTICATED");
      }
      const profile = prisma.profile.findUnique({
        where: {
          userId: parent.id,
        },
      });
      return profile;
    },
  },
  Profile: {
    // Custom resolver for the bio field of the Profile type
    user: (parent, _args, { prisma }) => {
      const user = prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
      return user;
    },
  },
  Post: {
    user: (parent, _args, { prisma }) => {
      // const user = prisma.user.findUnique({
      //   where: {
      //     id: parent.authorId,
      //   },
      // });
      // return user;
      return userLoader.load(parent.authorId);
    },
  },
};
