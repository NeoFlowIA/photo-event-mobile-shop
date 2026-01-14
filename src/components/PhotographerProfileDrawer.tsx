import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, X, Camera, Instagram, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photographer {
  id: string | number;
  name: string;
  handle: string;
  image: string;
  city: string;
  rating: number | string;
  portfolio: string[];
  specialty: string;
  description: string;
}

interface PhotographerProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  photographer: Photographer | null;
}

const PhotographerProfileDrawer = ({ open, onClose, photographer }: PhotographerProfileDrawerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!photographer) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === photographer.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? photographer.portfolio.length - 1 : prev - 1
    );
  };

  // Mock stats for demo
  const stats = {
    events: 48,
    photos: 3240,
    years: 5
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[92vh] bg-background">
          {/* Header com gradiente sutil */}
          <div className="relative bg-gradient-to-b from-primary/5 to-background pb-4">
            <DrawerHeader className="pb-0">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-lg font-semibold text-foreground">
                  Perfil do Fotógrafo
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-muted"
                    aria-label="Fechar"
                  >
                    <X size={18} />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
          </div>
          
          <div className="px-4 pb-8 space-y-6 overflow-y-auto">
            {/* Profile Header Card */}
            <Card className="border-0 shadow-sm bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Avatar com borda e efeito */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-lg">
                        <img
                          src={photographer.image}
                          alt={photographer.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/120x120/E03A3A/FFFFFF?text=${encodeURIComponent(photographer.name.split(' ')[0])}`;
                          }}
                        />
                      </div>
                      {/* Badge de verificado */}
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md">
                        <Award size={14} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {photographer.name}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-3">
                      <Instagram size={14} className="text-primary" />
                      <span className="text-sm font-medium">{photographer.handle}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin size={14} className="text-primary/70" />
                        <span>{photographer.city}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{photographer.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-0 font-medium"
                      >
                        <Camera size={12} className="mr-1" />
                        {photographer.specialty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.events}</p>
                  <p className="text-xs text-muted-foreground font-medium">Eventos</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.photos.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-muted-foreground font-medium">Fotos</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.years}</p>
                  <p className="text-xs text-muted-foreground font-medium">Anos exp.</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Sobre */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Sobre
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed pl-3">
                {photographer.description}
              </p>
            </div>
            
            {/* Portfolio Carousel */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Portfólio
              </h4>
              
              {/* Carousel principal */}
              <div className="relative group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-muted">
                  <img
                    src={photographer.portfolio[currentImageIndex]}
                    alt={`Trabalho ${currentImageIndex + 1} de ${photographer.name}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1516975080664?w=600&h=450&fit=crop`;
                    }}
                  />
                </div>
                
                {/* Navigation arrows */}
                {photographer.portfolio.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                
                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photographer.portfolio.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-primary w-6' 
                          : 'bg-background/70 hover:bg-background'
                      }`}
                      aria-label={`Ver imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {photographer.portfolio.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-${1516975080664 + index}?w=100&h=100&fit=crop`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PhotographerProfileDrawer;
