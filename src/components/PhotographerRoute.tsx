import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PhotographerRouteProps {
  children: ReactNode;
}

const PhotographerRoute = ({ children }: PhotographerRouteProps) => {
  const { isAuthenticated, isPhotographer, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check access after auth initialization
    if (!isInitializing && (!isAuthenticated || !isPhotographer)) {
      toast({
        title: "Acesso restrito",
        description: "Acesso restrito: área exclusiva para fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAuthenticated, isPhotographer, isInitializing, navigate]);

  // Show nothing while initializing or if no access
  if (isInitializing || !isAuthenticated || !isPhotographer) {
    return null;
  }

  return <>{children}</>;
};

export default PhotographerRoute;
