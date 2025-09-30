import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Images,
  Settings,
  Menu,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    description: 'Visão geral do marketplace',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/usuarios',
    label: 'Gestão de usuários',
    description: 'Clientes e fotógrafos',
    icon: Users,
  },
  {
    to: '/admin/eventos',
    label: 'Gestão de eventos',
    description: 'Aprovação e performance',
    icon: CalendarCheck,
  },
  {
    to: '/admin/fotos',
    label: 'Gestão de fotos',
    description: 'Fluxo de uploads e moderação',
    icon: Images,
  },
  {
    to: '/admin/configuracoes',
    label: 'Configurações',
    description: 'Parâmetros do sistema',
    icon: Settings,
  },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [openMobile, setOpenMobile] = useState(false);

  const renderNavigation = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              [
                'flex flex-col rounded-lg border px-4 py-3 transition-colors',
                isActive
                  ? 'border-primary/40 bg-primary/5 text-primary'
                  : 'border-transparent bg-white text-slate-700 hover:border-primary/20 hover:bg-primary/5',
              ].join(' ')
            }
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/lovable-uploads/f596c292-f0ef-4243-9d2e-647a4765cfbf.png"
              alt="Olha a Foto"
              className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/48x48/E03A3A/FFFFFF?text=OF';
              }}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Painel administrativo</p>
              <h1 className="text-lg font-semibold text-slate-900">Marketplace Olha a Foto</h1>
              <p className="text-xs text-slate-500">Controle operações, finanças e qualidade em um só lugar.</p>
            </div>
          </div>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Sessão ativa</span>
            <span className="text-sm font-semibold text-slate-900">{user?.displayName ?? 'Administrador'}</span>
            <span className="text-xs text-slate-500">{pathname}</span>
          </div>
          <div className="sm:hidden">
            <Button variant="outline" size="icon" onClick={() => setOpenMobile(true)} aria-label="Abrir menu">
              <Menu size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="hidden w-72 shrink-0 lg:block">{renderNavigation()}</aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
            <span>Home</span>
            <span>/</span>
            <span className="capitalize">
              {navItems.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))?.label ?? 'Dashboard'}
            </span>
          </div>
          <Outlet />
        </main>
      </div>

      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[20rem]">
          <SheetHeader>
            <SheetTitle>Navegação</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          {renderNavigation(() => setOpenMobile(false))}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminLayout;
