import { useState, useEffect } from 'react';
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
import { getEventBySlug, getEventById, getRelatedEvents, EventDetail } from '@/data/eventsMock';
import { useCart } from '@/hooks/useCart';
import { useSessionMock } from '@/hooks/useSessionMock';
import CpfModal from '@/components/CpfModal';
import { toast } from '@/components/ui/use-toast';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCpfModal, setShowCpfModal] = useState(false);
  const { count } = useCart();
  const { session } = useSessionMock();

  useEffect(() => {
    if (!slug) {
      navigate('/404');
      return;
    }

    // Try to get event by slug first, then by ID (for backward compatibility)
    let foundEvent = getEventBySlug(slug);
    if (!foundEvent) {
      foundEvent = getEventById(slug);
    }

    if (foundEvent) {
      setEvent(foundEvent);
      // Update page title and meta
      document.title = `${foundEvent.title} — ${foundEvent.city} — ${formatDate(foundEvent.date)}`;
    } else {
      navigate('/404');
    }
    setLoading(false);
  }, [slug, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title || '',
      text: `Confira as fotos do evento ${event?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link do evento foi copiado para sua área de transferência.",
        });
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleSelfieMatch = () => {
    if (!session.cpf) {
      setShowCpfModal(true);
    } else {
      // Open selfie match dialog (would implement the actual selfie matching component)
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "O match por selfie estará disponível em breve!",
      });
    }
  };

  const handleContactPhotographer = () => {
    toast({
      title: "Contato com fotógrafo",
      description: "Funcionalidade de contato será implementada em breve!",
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

  if (!event) {
    return null; // Will redirect to 404
  }

  const relatedEvents = getRelatedEvents(event.id);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/eventos">Eventos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{event.title}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Event Header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={20} className="text-primary" />
                  <span>{event.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={20} className="text-primary" />
                  <span>{formatDateLong(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={20} className="text-primary" />
                  <span>{event.venue}</span>
                </div>
              </div>

              {/* Photographer Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={event.author.avatar} alt={event.author.name} />
                  <AvatarFallback>{event.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{event.author.name}</p>
                  <p className="text-sm text-gray-600">{event.author.handle}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search and Actions Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por número, CPF ou palavra-chave"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSelfieMatch} variant="outline">
                Encontrei minha foto?
              </Button>
              {count > 0 && (
                <Button asChild>
                  <Link to="/carrinho">
                    Ver carrinho ({count})
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Photo Gallery */}
          <div className="lg:col-span-3">
            <PhotoGallery
              photos={event.photos}
              eventId={event.id}
              eventTitle={event.title}
            />
          </div>

          {/* Event Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Informações do evento</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Data e horário</h4>
                    <p className="text-gray-600">{formatDateLong(event.date)}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Local</h4>
                    <p className="text-gray-600">{event.venue}</p>
                    <p className="text-gray-600">{event.city}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Categoria</h4>
                    <p className="text-gray-600">{event.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Resolução</h4>
                    <p className="text-gray-600">{event.resolution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Política de uso</h4>
                    <p className="text-gray-600">{event.policy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Eventos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Card key={relatedEvent.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <Link to={`/eventos/${relatedEvent.slug}`}>
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={relatedEvent.cover}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedEvent.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{relatedEvent.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{formatDate(relatedEvent.date)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Navbar />

      {/* CPF Modal */}
      <CpfModal
        open={showCpfModal}
        onClose={() => setShowCpfModal(false)}
        onConfirm={() => {
          setShowCpfModal(false);
          handleSelfieMatch();
        }}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "startDate": event.date,
            "location": {
              "@type": "Place",
              "name": event.venue,
              "address": event.city
            },
            "organizer": {
              "@type": "Person",
              "name": event.author.name
            },
            "description": event.description
          })
        }}
      />
    </div>
  );
};

export default EventDetailPage;