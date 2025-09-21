import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService, AuthRole, AuthSuccessResponse, AuthUser, LoginPayload, RegisterPayload } from '@/services/authService';
import { ApiError } from '@/lib/http';

const REFRESH_TOKEN_KEY = 'of.auth.refreshToken';
const REFRESH_TOKEN_EXPIRES_KEY = 'of.auth.refreshTokenExpiresAt';
const USER_CACHE_KEY = 'of.auth.user';

type AuthAction = 'login' | 'register' | 'logout' | 'refresh' | null;

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  pendingAction: AuthAction;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setCpf: (cpf: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  hasRole: (role: AuthRole) => boolean;
  currentRole: AuthRole | null;
  isPhotographer: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeAuthResponse = (response: AuthSuccessResponse) => {
  const roles = (response.roles || response.user.roles || []) as AuthRole[];
  const defaultRole = (response.defaultRole || response.user.defaultRole || roles[0]) as AuthRole | undefined;

  return {
    ...response,
    roles,
    defaultRole,
    user: {
      ...response.user,
      roles,
      defaultRole,
      photographerProfile: response.user.photographerProfile ?? null,
    },
  } satisfies AuthSuccessResponse;
};

const isBrowser = typeof window !== 'undefined';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AuthAction>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const persistRefreshToken = useCallback((token: string | null, expiresAt: string | null) => {
    if (!isBrowser) return;
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    if (expiresAt) {
      localStorage.setItem(REFRESH_TOKEN_EXPIRES_KEY, expiresAt);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_EXPIRES_KEY);
    }
  }, []);

  const persistUser = useCallback((value: AuthUser | null | ((current: AuthUser | null) => AuthUser | null)) => {
    setUser((current) => {
      const nextValue = typeof value === 'function' ? (value as (current: AuthUser | null) => AuthUser | null)(current) : value;

      if (isBrowser) {
        if (nextValue) {
          localStorage.setItem(USER_CACHE_KEY, JSON.stringify(nextValue));
        } else {
          localStorage.removeItem(USER_CACHE_KEY);
        }
      }

      return nextValue;
    });
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setRefreshTokenExpiresAt(null);
    persistRefreshToken(null, null);
    persistUser(null);
  }, [persistRefreshToken, persistUser]);

  const loadProfile = useCallback(async (token: string) => {
    try {
      const profile = await authService.profile(token);
      let normalizedProfile: AuthUser | null = null;
      persistUser((current) => {
        const roles = (profile.roles || current?.roles || []) as AuthRole[];
        const defaultRole = (profile.defaultRole || current?.defaultRole || roles[0]) as AuthRole | undefined;
        normalizedProfile = {
          ...current,
          ...profile,
          roles,
          defaultRole,
          photographerProfile: profile.photographerProfile ?? null,
        } as AuthUser;
        return normalizedProfile;
      });
      return normalizedProfile;
    } catch (error) {
      console.warn('Failed to load profile', error);
      throw error;
    }
  }, [persistUser]);

  const applyAuthResponse = useCallback((response: AuthSuccessResponse) => {
    const normalized = normalizeAuthResponse(response);
    setAccessToken(normalized.accessToken);
    setRefreshToken(normalized.refreshToken);
    setRefreshTokenExpiresAt(normalized.refreshTokenExpiresAt ?? null);
    persistRefreshToken(normalized.refreshToken, normalized.refreshTokenExpiresAt ?? null);
    persistUser(normalized.user);
    return normalized;
  }, [persistRefreshToken, persistUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    setPendingAction('login');
    try {
      const response = await authService.login(payload);
      const normalized = applyAuthResponse(response);
      try {
        await loadProfile(normalized.accessToken);
      } catch (error) {
        // profile fetch failure should not block login flow
      }
      return normalized.user;
    } finally {
      setPendingAction((current) => (current === 'login' ? null : current));
    }
  }, [applyAuthResponse, loadProfile]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setPendingAction('register');
    try {
      const response = await authService.register(payload);
      const normalized = applyAuthResponse(response);
      try {
        await loadProfile(normalized.accessToken);
      } catch (error) {
        // ignore profile failure
      }
      return normalized.user;
    } finally {
      setPendingAction((current) => (current === 'register' ? null : current));
    }
  }, [applyAuthResponse, loadProfile]);

  const refresh = useCallback(async () => {
    const token = refreshToken || (isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);
    if (!token) {
      clearSession();
      return;
    }

    setPendingAction((current) => current ?? 'refresh');
    try {
      const response = await authService.refresh({ refreshToken: token });
      const normalized = applyAuthResponse(response);
      try {
        await loadProfile(normalized.accessToken);
      } catch (error) {
        // ignore profile failure on refresh
      }
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      setPendingAction((current) => (current === 'refresh' ? null : current));
    }
  }, [applyAuthResponse, clearSession, loadProfile, refreshToken]);

  const logout = useCallback(async () => {
    const token = refreshToken || (isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);
    setPendingAction('logout');
    try {
      if (token) {
        try {
          await authService.logout({ refreshToken: token });
        } catch (error) {
          if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
            // Already invalid, safe to ignore
          } else {
            throw error;
          }
        }
      }
    } finally {
      clearSession();
      setPendingAction((current) => (current === 'logout' ? null : current));
    }
  }, [clearSession, refreshToken]);

  const setCpf = useCallback((cpf: string) => {
    persistUser((current) => (current ? { ...current, cpf } : current));
  }, [persistUser]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    persistUser((current) => (current ? { ...current, ...updates } : current));
  }, [persistUser]);

  useEffect(() => {
    if (!isBrowser) {
      setIsInitializing(false);
      return;
    }

    const storedUser = localStorage.getItem(USER_CACHE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setUser(parsed);
      } catch (error) {
        localStorage.removeItem(USER_CACHE_KEY);
      }
    }

    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedExpires = localStorage.getItem(REFRESH_TOKEN_EXPIRES_KEY);

    if (storedRefresh) {
      setRefreshToken(storedRefresh);
      setRefreshTokenExpiresAt(storedExpires ?? null);
      refresh().finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const roles = (user?.roles || []) as AuthRole[];
    const currentRole = (user?.defaultRole || roles[0] || null) as AuthRole | null;
    const hasRole = (role: AuthRole) => roles.includes(role);

    return {
      user,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      isAuthenticated: Boolean(user && accessToken),
      isInitializing,
      pendingAction,
      login,
      register,
      logout,
      refresh,
      setCpf,
      updateUser,
      hasRole,
      currentRole,
      isPhotographer: hasRole('photographer'),
      isUser: hasRole('user'),
    };
  }, [accessToken, refreshToken, refreshTokenExpiresAt, isInitializing, login, logout, pendingAction, refresh, register, setCpf, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
