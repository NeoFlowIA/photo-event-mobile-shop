const HASURA_GRAPHQL_URL = import.meta.env.VITE_HASURA_GRAPHQL_URL;

const HASURA_ADMIN_SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET;

export interface GraphQLRequestOptions {
  token?: string | null;
  useAdminSecret?: boolean;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export class GraphQLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphQLError";
  }
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: GraphQLRequestOptions = {}
): Promise<T> {
  if (!HASURA_GRAPHQL_URL) {
    throw new GraphQLError("VITE_HASURA_GRAPHQL_URL não definido.");
  }
  const { token, useAdminSecret, headers, signal } = options;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (useAdminSecret) {
    if (!HASURA_ADMIN_SECRET) {
      console.warn("VITE_HASURA_ADMIN_SECRET não definido. A requisição pode falhar.");
    } else {
      requestHeaders["x-hasura-admin-secret"] = HASURA_ADMIN_SECRET;
    }
  }

  const response = await fetch(HASURA_GRAPHQL_URL, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!response.ok) {
    throw new GraphQLError(`Falha na requisição GraphQL (${response.status})`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors && payload.errors.length > 0) {
    throw new GraphQLError(payload.errors.map((error) => error.message).join("\n"));
  }

  if (!payload.data) {
    throw new GraphQLError("Resposta GraphQL sem dados");
  }

  return payload.data;
}

export type { GraphQLResponse };
