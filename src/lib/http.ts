export const API_BASE_URL = "https://whatsapp-olha-a-foto-backend.t2wird.easypanel.host";

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

interface ApiFetchOptions extends RequestInit {
  authToken?: string;
  skipJson?: boolean;
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: typeof body === "string" || body === undefined ? body : JSON.stringify(body),
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
