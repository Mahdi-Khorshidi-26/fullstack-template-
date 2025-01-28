import { GraphQLError } from "graphql";

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
};
