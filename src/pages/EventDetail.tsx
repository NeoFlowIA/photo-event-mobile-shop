import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Building2, Search, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import PhotoGallery from '@/components/PhotoGallery';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import CpfModal from '@/components/CpfModal';
import { toast } from '@/components/ui/use-toast';
import { EventDetail as HasuraEventDetail, EventSummary, getEventById, getEventBySlug, searchEvents } from '@/services/eventService';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<HasuraEventDetail | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCpfModal, setShowCpfModal] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) {
      navigate('/404');
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        let fetched = await getEventBySlug(slug, undefined, controller.signal);
        if (!fetched) {
          fetched = await getEventById(slug, undefined, controller.signal);
        }

        if (!fetched) {
          if (isMounted) {
            setError('Evento não encontrado.');
            setEvent(null);
          }
          return;
        }

        if (isMounted) {
          setEvent(fetched);
          document.title = `${fetched.title ?? 'Evento'} — ${fetched.city ?? ''}`;
        }

        const related = await searchEvents({ city: fetched.city ?? undefined, limit: 4 }, controller.signal);
        if (isMounted) {
          setRelatedEvents(related.filter((item) => item.id !== fetched.id));
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Erro ao carregar evento', err);
        if (isMounted) {
          setError('Não foi possível carregar o evento no momento.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, navigate]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data a definir';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Data a definir';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateLong = (dateString?: string | null) => {
    if (!dateString) return 'Data a definir';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Data a definir';
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const locationLabel = useMemo(() => {
    if (!event) return 'Local a definir';
    const parts = [event.city, event.state].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Local a definir';
  }, [event]);

  const handleShare = async () => {
    const shareData = {
      title: event?.title || '',
      text: `Confira as fotos do evento ${event?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (shareError) {
        console.warn('Compartilhamento cancelado', shareError);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copiado!',
          description: 'O link do evento foi copiado para sua área de transferência.',
        });
      } catch (clipboardError) {
        console.error('Erro ao copiar link:', clipboardError);
      }
    }
  };

  const handleSelfieMatch = () => {
    if (!user?.cpf) {
      setShowCpfModal(true);
    } else {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'O match por selfie estará disponível em breve!',
      });
    }
  };

  const handleContactPhotographer = () => {
    toast({
      title: 'Contato com fotógrafo',
      description: 'Funcionalidade de contato será implementada em breve!',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-red-500">{error ?? 'Evento não encontrado.'}</p>
        <Button onClick={() => navigate('/buscar-eventos')}>Voltar para busca</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header />

      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/buscar-eventos">Eventos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{event.title}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={20} className="text-primary" />
                  <span>{locationLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} className="text-primary" />
                  <span>{formatDateLong(event.start_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={20} className="text-primary" />
                  <span>{event.venue_name ?? 'Local a definir'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={event.cover_url ?? ''} alt={event.title ?? ''} />
                  <AvatarFallback>{event.title?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{event.owner_id ? 'Fotógrafo responsável' : 'Evento público'}</p>
                  <p className="text-sm text-gray-600">ID do organizador: {event.owner_id ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </Button>
              <Button onClick={handleContactPhotographer} variant="outline" className="flex-1">
                <MessageCircle size={16} className="mr-2" />
                Falar com fotógrafo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Galeria de fotos</h2>
                  <p className="text-gray-600">As fotos serão disponibilizadas assim que os fotógrafos finalizarem o upload.</p>
                </div>
                <Button onClick={handleSelfieMatch} className="flex items-center gap-2">
                  <Search size={18} />
                  Buscar por selfie ou número
                </Button>
              </div>

              <PhotoGallery photos={[]} eventId={event.id} eventTitle={event.title ?? ''} />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Sobre o evento</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {event.description || 'O organizador ainda não adicionou uma descrição detalhada para este evento.'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Data</span>
                      <span>{formatDate(event.start_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Local</span>
                      <span>{event.venue_name ?? locationLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Cidade</span>
                      <span>{event.city ?? 'A definir'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">Estado</span>
                      <span>{event.state ?? 'A definir'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Buscar fotos</h3>
                  <p className="text-sm text-gray-600">Encontre suas fotos rapidamente utilizando o número do peito ou selfie.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast({
                      title: 'Busca em desenvolvimento',
                      description: 'A busca por número será integrada ao Hasura em breve.',
                    });
                  }}
                  className="space-y-3"
                >
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite o número do participante"
                  />
                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Search size={16} />
                    Buscar fotos
                  </Button>
                </form>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Assim que as fotos estiverem disponíveis você poderá adicioná-las ao carrinho e finalizar a compra em poucos cliques.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Outros eventos</h3>
                  <p className="text-sm text-gray-600">Confira eventos próximos ou realizados na mesma região.</p>
                </div>

                <div className="space-y-3">
                  {relatedEvents.slice(0, 4).map((related) => (
                    <Link
                      key={related.id}
                      to={`/eventos/${related.slug ?? related.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-primary transition"
                    >
                      <p className="font-medium text-gray-900">{related.title}</p>
                      <p className="text-xs text-gray-500">{[related.city, related.state].filter(Boolean).join(' ')}</p>
                      <p className="text-xs text-gray-500">{formatDate(related.start_at)}</p>
                    </Link>
                  ))}

                  {relatedEvents.length === 0 && (
                    <p className="text-sm text-gray-500">Nenhum outro evento encontrado nesta região.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Carrinho</h3>
                  <p className="text-sm text-gray-600">Você possui {count} item{count === 1 ? '' : 's'} no carrinho.</p>
                </div>
                <Button onClick={() => navigate('/carrinho')} className="w-full">
                  Ir para o carrinho
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Navbar />

      <CpfModal 
        open={showCpfModal} 
        onOpenChange={setShowCpfModal}
        onClose={() => setShowCpfModal(false)}
        onConfirm={() => setShowCpfModal(false)}
      />
    </div>
  );
};

export default EventDetailPage;
