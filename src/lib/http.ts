const DEFAULT_API_BASE_URL = "https://whatsapp-olha-a-foto-backend.t2wird.easypanel.host";

const envApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedApiBase = envApiBase && envApiBase.length > 0 ? envApiBase : DEFAULT_API_BASE_URL;

function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const sanitizedBase = normalizedApiBase.replace(/\/+$/, "");
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${sanitizedBase}${sanitizedPath}`;
}

export const API_BASE_URL = normalizedApiBase;

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  authToken?: string;
  skipJson?: boolean;
  body?: unknown;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { authToken, headers, body, skipJson, ...rest } = options;

  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const requestUrl = buildApiUrl(path);

  const response = await fetch(requestUrl, {
    ...rest,
    headers: requestHeaders,
    body: (typeof body === "string" || body === undefined ? body : JSON.stringify(body)) as BodyInit | undefined,
  });

  if (response.status === 204 || skipJson) {
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    return undefined as T;
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    let message = response.statusText || "Erro inesperado";

    if (data && typeof data === "object") {
      const errorPayload = data as Record<string, unknown>;
      const errorMessage = (errorPayload.error ?? errorPayload.message) as string | undefined;
      if (errorMessage) {
        message = errorMessage;
      }
    }

    throw new ApiError(response.status, message, data);
  }

  return data as T;
}
