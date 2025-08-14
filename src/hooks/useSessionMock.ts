import { useState, useEffect } from 'react';

type Role = 'cliente' | 'fotografo';

interface SessionData {
  loggedIn: boolean;
  role: Role | null;
  nome?: string;
  email?: string;
  cpf?: string;
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

// Demo users for quick access
const DEMO_USERS = [
  { email: "joao@teste.com", senha: "123456", role: "cliente" as Role, nome: "João Silva", cpf: "123.456.789-09" },
  { email: "ana@foto.com", senha: "123456", role: "fotografo" as Role, nome: "Ana Aquino", cpf: undefined }
] as const;

const defaultSession: SessionData = {
  loggedIn: false,
  role: null,
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

  const loginWith = (email: string, senha: string) => {
    const user = DEMO_USERS.find(u => u.email === email && u.senha === senha);
    if (user) {
      const perfil = user.role === 'fotografo' ? { handle: `@${user.nome.toLowerCase().replace(/\s+/g, '')}` } : undefined;
      updateSession({ 
        loggedIn: true, 
        role: user.role, 
        nome: user.nome, 
        email: user.email, 
        cpf: user.cpf,
        perfil 
      });
      return true;
    }
    return false;
  };

  const login = (nome: string, email: string, role: Role, cpf?: string, perfil?: SessionData['perfil']) => {
    updateSession({ loggedIn: true, role, nome, email, cpf, perfil });
  };

  const logout = () => {
    setSession(defaultSession);
    localStorage.removeItem(STORAGE_KEY);
  };

  const is = (role: Role) => {
    return session.loggedIn && session.role === role;
  };

  const setCPF = (cpf: string) => {
    updateSession({ cpf });
  };

  return {
    session,
    loginWith,
    login,
    logout,
    is,
    setCPF,
    saveCpf: setCPF, // Legacy alias for compatibility
    updateSession,
    DEMO_USERS,
  };
};