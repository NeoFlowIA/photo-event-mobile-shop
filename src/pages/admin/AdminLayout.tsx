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
    <nav className="space-y-2" aria-label="Seções do painel">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => onNavigate?.()}
            aria-label={item.label}
            className={({ isActive }) =>
              [
                'group flex flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40',
                isActive
                  ? 'border-primary/50 bg-primary/10 text-primary shadow-sm'
                  : 'border-transparent bg-white/80 text-slate-700 hover:border-primary/30 hover:bg-primary/5',
              ].join(' ')
            }
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100/60">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-1/2 focus:top-4 focus:-translate-x-1/2 focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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
          <div className="hidden flex-col items-end text-right sm:flex">
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

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-10">
        <aside className="sticky top-32 hidden h-max w-72 shrink-0 space-y-4 lg:block" aria-label="Menu administrativo">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navegação</p>
            <Separator className="my-3" />
            {renderNavigation()}
          </div>
        </aside>

        <main id="conteudo-principal" className="flex-1 space-y-8 pb-16">
          <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
            <span className="font-medium text-slate-400">Home</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-600">
              {navItems.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))?.label ?? 'Dashboard'}
            </span>
          </nav>
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
