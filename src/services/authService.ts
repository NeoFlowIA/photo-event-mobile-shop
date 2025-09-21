import { apiFetch } from '@/lib/http';

export type AuthRole = 'user' | 'photographer' | 'admin';

export interface PhotographerProfilePayload {
  biography?: string | null;
  phoneNumber?: string | null;
  websiteUrl?: string | null;
  socialLinks?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  cpf?: string | null;
  acceptedTerms?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
  role?: AuthRole;
  cpf?: string;
  acceptedTerms?: boolean;
  photographerProfile?: PhotographerProfilePayload;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  cpf?: string | null;
  acceptedTerms?: boolean;
  roles?: AuthRole[];
  defaultRole?: AuthRole;
  photographerProfile?: PhotographerProfilePayload | null;
  [key: string]: unknown;
}

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt?: string;
  user: AuthUser;
  roles?: AuthRole[];
  defaultRole?: AuthRole;
}

export interface RefreshPayload {
  refreshToken: string;
}

export type RefreshResponse = AuthSuccessResponse;

export interface LogoutPayload {
  refreshToken: string;
}

export const authService = {
  register(payload: RegisterPayload) {
    return apiFetch<AuthSuccessResponse>('/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  login(payload: LoginPayload) {
    return apiFetch<AuthSuccessResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  },

  refresh(payload: RefreshPayload) {
    return apiFetch<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: payload,
    });
  },

  logout(payload: LogoutPayload) {
    return apiFetch<{ message?: string }>('/auth/logout', {
      method: 'POST',
      body: payload,
    });
  },

  profile(accessToken: string) {
    return apiFetch<AuthUser>('/auth/profile', {
      method: 'GET',
      authToken: accessToken,
    });
  },
};
