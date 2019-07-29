import { InMemoryCache } from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { ApolloLink, split } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpLink = createHttpLink({ uri: "http://localhost:8080/graphql" });

// Middleware
const middlewareLink = setContext(() => ({
  headers: {
    "x-token": localStorage.getItem("token"),
    "x-refresh-token": localStorage.getItem("refreshToken")
  }
}));

// Afterware
const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get("x-token");
    const refreshToken = headers.get("x-refresh-token");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  return forward(operation);
});

const httpLinkWithMiddlewares = afterwareLink.concat(
  middlewareLink.concat(httpLink)
);

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    }
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkWithMiddlewares
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
