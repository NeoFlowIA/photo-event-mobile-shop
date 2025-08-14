import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionMock } from '@/hooks/useSessionMock';
import { toast } from '@/hooks/use-toast';

interface PhotographerRouteProps {
  children: ReactNode;
}

const PhotographerRoute = ({ children }: PhotographerRouteProps) => {
  const { session } = useSessionMock();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.loggedIn || session.tipo !== 'fotografo') {
      toast({
        title: "Acesso restrito",
        description: "Esta área é restrita a fotógrafos cadastrados.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [session, navigate]);

  if (!session.loggedIn || session.tipo !== 'fotografo') {
    return null;
  }

  return <>{children}</>;
};

export default PhotographerRoute;