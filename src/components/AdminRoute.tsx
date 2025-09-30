import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && (!isAuthenticated || !isAdmin)) {
      toast({
        title: 'Acesso restrito',
        description: 'Painel exclusivo para administradores da plataforma.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, isInitializing, navigate]);

  if (isInitializing || !isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
