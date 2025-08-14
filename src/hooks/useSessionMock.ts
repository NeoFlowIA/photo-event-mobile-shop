import { useState, useEffect } from 'react';

interface SessionData {
  loggedIn: boolean;
  nome?: string;
  cpf?: string;
  tipo?: 'cliente' | 'fotografo';
  email?: string;
  perfil?: {
    bio?: string;
    telefone?: string;
    website?: string;
    redes?: string;
    urlPerfil?: string;
    urlCapa?: string;
    handle?: string;
  };
}

const STORAGE_KEY = 'of.session.v1';

const defaultSession: SessionData = {
  loggedIn: false,
};

export const useSessionMock = () => {
  const [session, setSession] = useState<SessionData>(defaultSession);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      } catch (error) {
        console.warn('Failed to parse session from localStorage', error);
      }
    }
  }, []);

  const updateSession = (updates: Partial<SessionData>) => {
    const newSession = { ...session, ...updates };
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  };

  const login = (nome: string, cpf?: string, tipo?: 'cliente' | 'fotografo', email?: string, perfil?: SessionData['perfil']) => {
    updateSession({ loggedIn: true, nome, cpf, tipo, email, perfil });
  };

  const logout = () => {
    setSession(defaultSession);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveCpf = (cpf: string) => {
    updateSession({ cpf });
  };

  return {
    session,
    login,
    logout,
    saveCpf,
    updateSession,
  };
};