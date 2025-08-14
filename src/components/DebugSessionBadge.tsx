import { useSessionMock } from '@/hooks/useSessionMock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DebugSessionBadge = () => {
  const { session, loginWith, logout, DEMO_USERS, hydrated } = useSessionMock();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const loginClienteDemo = () => {
    const cliente = DEMO_USERS.find(u => u.role === 'cliente');
    if (cliente) {
      loginWith(cliente.email, cliente.senha);
    }
  };

  const loginFotografoDemo = () => {
    const fotografo = DEMO_USERS.find(u => u.role === 'fotografo');
    if (fotografo) {
      loginWith(fotografo.email, fotografo.senha);
    }
  };

  return (
    <div className="fixed bottom-2 right-2 z-50 p-3 bg-background border rounded-lg shadow-lg max-w-xs">
      <div className="text-xs space-y-1 mb-2">
        <div>role: <Badge variant="outline">{session.role || 'null'}</Badge></div>
        <div>loggedIn: <Badge variant="outline">{session.loggedIn ? 'true' : 'false'}</Badge></div>
        <div>hydrated: <Badge variant="outline">{hydrated ? 'true' : 'false'}</Badge></div>
        <div>nome: <Badge variant="outline">{session.nome || 'null'}</Badge></div>
      </div>
      <div className="flex gap-1 flex-wrap">
        <Button size="sm" variant="outline" onClick={loginClienteDemo}>
          Cliente demo
        </Button>
        <Button size="sm" variant="outline" onClick={loginFotografoDemo}>
          Fotógrafo demo
        </Button>
        <Button size="sm" variant="destructive" onClick={logout}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DebugSessionBadge;