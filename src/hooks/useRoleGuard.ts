import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionMock } from './useSessionMock';
import { toast } from './use-toast';

type Role = 'cliente' | 'fotografo';

export const useRoleGuard = (allowedRoles: Role[]) => {
  const { session } = useSessionMock();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.loggedIn || !session.role || !allowedRoles.includes(session.role)) {
      toast({
        title: "Acesso restrito",
        description: "Acesso restrito: área exclusiva para fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [session, allowedRoles, navigate]);

  return session.loggedIn && session.role && allowedRoles.includes(session.role);
};

export const withRoleGuard = (allowedRoles: Role[]) => {
  return function withRoleGuardWrapper(WrappedComponent: React.ComponentType<any>) {
    return function GuardedComponent(props: any) {
      const hasAccess = useRoleGuard(allowedRoles);
      
      if (!hasAccess) {
        return null;
      }

      return React.createElement(WrappedComponent, props);
    };
  };
};