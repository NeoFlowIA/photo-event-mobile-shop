import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './use-toast';

type Role = 'cliente' | 'fotografo';

export const useRoleGuard = (allowedRoles: Role[]) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    const currentRole = user?.defaultRole || user?.roles?.[0];
    const mappedRole = mapRole(currentRole);

    if (!isAuthenticated || !mappedRole || !allowedRoles.includes(mappedRole)) {
      toast({
        title: "Acesso restrito",
        description: "Acesso restrito: área exclusiva para fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [allowedRoles, isAuthenticated, isInitializing, navigate, user]);

  const currentRole = user?.defaultRole || user?.roles?.[0];
  const mappedRole = mapRole(currentRole);
  return Boolean(!isInitializing && isAuthenticated && mappedRole && allowedRoles.includes(mappedRole));
};

const mapRole = (role?: string | null) => {
  if (!role) return undefined;
  if (role === 'photographer' || role === 'fotografo') return 'fotografo';
  if (role === 'user' || role === 'cliente') return 'cliente';
  return role as Role;
};

export const withRoleGuard = (allowedRoles: Role[]) => {
  return function withRoleGuardWrapper<P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) {
    return function GuardedComponent(props: P) {
      const hasAccess = useRoleGuard(allowedRoles);

      if (!hasAccess) {
        return null;
      }

      return React.createElement(WrappedComponent, props);
    };
  };
};
