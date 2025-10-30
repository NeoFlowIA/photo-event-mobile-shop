import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, X } from 'lucide-react';

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
  if (!photographer) return null;

  return (
    <>
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle>Perfil do Fotógrafo</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X size={16} />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="px-4 pb-6 space-y-6 overflow-y-auto">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
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
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[var(--brand-secondary)]">
                  {photographer.name}
                </h3>
                <p className="text-[var(--brand-muted)] mb-2">{photographer.handle}</p>
                
                <div className="flex items-center gap-4 text-sm text-[var(--brand-muted)]">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{photographer.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    <span>{photographer.rating}</span>
                  </div>
                </div>
                
                <Badge variant="secondary" className="mt-2">
                  {photographer.specialty}
                </Badge>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h4 className="font-semibold text-[var(--brand-secondary)] mb-2">Sobre</h4>
              <p className="text-[var(--brand-muted)] text-sm leading-relaxed">
                {photographer.description}
              </p>
            </div>
            
            {/* Portfolio */}
            <div>
              <h4 className="font-semibold text-[var(--brand-secondary)] mb-3">Portfólio</h4>
              <div className="grid grid-cols-3 gap-2">
                {photographer.portfolio.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Trabalho ${index + 1} de ${photographer.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-${1516975080664 + index}?w=200&h=200&fit=crop`;
                      }}
                    />
                  </div>
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