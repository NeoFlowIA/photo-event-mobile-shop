import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionMock } from '@/hooks/useSessionMock';
import { toast } from '@/hooks/use-toast';

interface PhotographerRouteProps {
  children: ReactNode;
}

const PhotographerRoute = ({ children }: PhotographerRouteProps) => {
  const { session, is } = useSessionMock();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.loggedIn || !is('fotografo')) {
      toast({
        title: "Acesso restrito",
        description: "Acesso restrito: área exclusiva para fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [session, is, navigate]);

  if (!session.loggedIn || !is('fotografo')) {
    return null;
  }

  return <>{children}</>;
};

export default PhotographerRoute;