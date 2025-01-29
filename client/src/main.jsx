import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { persistCache } from "apollo3-cache-persist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
]);

// Define the HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql", // Replace with your endpoint
});

const cache = new InMemoryCache();
// // Persist cache
(async () => {
  await persistCache({
    cache,
    storage: window.localStorage, // Use localStorage for persistence
  });
})();

// Use setContext to set the headers
const authLink = setContext((_, { headers }) => {
  // Get the token from local storage or any other source
  const token = localStorage.getItem("accessToken");
  if (!token) {
    //when the token is not available in local storage, we can redirect the user to the login page and return an the headers as they are
    // window.location.href = "/login";
    return {
      headers,
    };
  }
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Add the token if available
    },
  };
});

// Combine authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  devtools: true,
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: "cache-and-network",
  //   },
  //   query: {
  //     fetchPolicy: "cache-and-network",
  //   },
  // },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={routes} />
    </ApolloProvider>
  </StrictMode>
);
