import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Images,
  Settings,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/usuarios',
    label: 'Usuários',
    icon: Users,
  },
  {
    to: '/admin/eventos',
    label: 'Eventos',
    icon: CalendarCheck,
  },
  {
    to: '/admin/fotos',
    label: 'Fotos',
    icon: Images,
  },
  {
    to: '/admin/vendas',
    label: 'Vendas',
    icon: ShoppingBag,
  },
  {
    to: '/admin/configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [openMobile, setOpenMobile] = useState(false);

  const renderNavigation = (onNavigate?: () => void) => (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isCurrent = item.end ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--admin-primary))]/40',
                isActive
                  ? 'bg-[hsl(var(--admin-primary))]/10 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')
            }
          >
            <Icon
              size={18}
              className={isCurrent ? 'text-[hsl(var(--admin-primary))]' : 'text-slate-400'}
            />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  const activeNavItem = navItems.find((item) => 
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo + Menu */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpenMobile(true)} 
              className="lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/f596c292-f0ef-4243-9d2e-647a4765cfbf.png"
                alt="Olha a Foto"
                className="h-8 w-8 rounded object-cover"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/32x32/006CFF/FFFFFF?text=OF';
                }}
              />
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-slate-900">Painel Administrativo</h1>
                <p className="text-xs text-slate-500">Olha a Foto Marketplace</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.displayName ?? 'Admin'}</p>
              <p className="text-xs text-slate-500">{activeNavItem?.label ?? 'Dashboard'}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--admin-primary))] flex items-center justify-center text-white text-sm font-medium">
              {(user?.displayName ?? 'A')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-6">
          {renderNavigation()}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-64 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/f596c292-f0ef-4243-9d2e-647a4765cfbf.png"
                alt="Olha a Foto"
                className="h-8 w-8 rounded object-cover"
              />
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Painel Admin</h2>
                <p className="text-xs text-slate-500">Navegação</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </Button>
          </div>
          {renderNavigation(() => setOpenMobile(false))}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminLayout;
