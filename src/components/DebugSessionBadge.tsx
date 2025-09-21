import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const DebugSessionBadge = () => {
  const { user, isAuthenticated, currentRole, pendingAction, logout, refresh, refreshTokenExpiresAt } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 p-3 bg-background border rounded-lg shadow-lg max-w-xs space-y-2 text-xs">
      <div className="space-y-1">
        <div>
          autenticado:{' '}
          <Badge variant="outline">{isAuthenticated ? 'sim' : 'não'}</Badge>
        </div>
        <div>
          role atual:{' '}
          <Badge variant="outline">{currentRole ?? 'indefinido'}</Badge>
        </div>
        <div>
          usuário:{' '}
          <Badge variant="outline">{user?.displayName ?? '—'}</Badge>
        </div>
        {refreshTokenExpiresAt && (
          <div>
            expiração RT:{' '}
            <Badge variant="outline">{new Date(refreshTokenExpiresAt).toLocaleString()}</Badge>
          </div>
        )}
        <div>
          ação pendente:{' '}
          <Badge variant="outline">{pendingAction ?? 'nenhuma'}</Badge>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        <Button size="sm" variant="outline" onClick={refresh} disabled={pendingAction === 'refresh'}>
          Atualizar perfil
        </Button>
        <Button size="sm" variant="destructive" onClick={logout} disabled={pendingAction === 'logout'}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DebugSessionBadge;
