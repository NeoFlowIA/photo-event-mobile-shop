import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionMock } from '@/hooks/useSessionMock';
import { toast } from '@/hooks/use-toast';

interface PhotographerRouteProps {
  children: ReactNode;
}

const PhotographerRoute = ({ children }: PhotographerRouteProps) => {
  const { session, is, hydrated } = useSessionMock();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check access after session is hydrated from localStorage
    if (hydrated && (!session.loggedIn || !is('fotografo'))) {
      toast({
        title: "Acesso restrito",
        description: "Acesso restrito: área exclusiva para fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [session, is, navigate, hydrated]);

  // Show nothing while hydrating or if no access
  if (!hydrated || !session.loggedIn || !is('fotografo')) {
    return null;
  }

  return <>{children}</>;
};

export default PhotographerRoute;