/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_HASURA_GRAPHQL_URL: string;
  readonly VITE_HASURA_ADMIN_SECRET: string;
  readonly VITE_HASURA_JWT_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
