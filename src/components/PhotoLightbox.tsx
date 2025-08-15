import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { EventPhoto } from '@/data/eventsMock';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';

interface PhotoLightboxProps {
  photos: EventPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const PhotoLightbox = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  eventId,
  eventTitle
}: PhotoLightboxProps) => {
  const [index, setIndex] = useState(currentIndex);
  const { addToCart, isInCart } = useCart();

  const currentPhoto = photos[index];

  const goToPrevious = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    if (addToCart(currentPhoto, eventId, eventTitle)) {
      toast({
        title: "Foto adicionada ao carrinho",
        description: `R$ ${currentPhoto.price.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Foto já está no carrinho",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isInCart(currentPhoto.id)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart size={16} className="mr-2" />
              {isInCart(currentPhoto.id) ? 'No carrinho' : `R$ ${currentPhoto.price.toFixed(2)}`}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={goToPrevious}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={24} />
          </Button>

          <Button
            onClick={goToNext}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            aria-label="Próxima foto"
          >
            <ChevronRight size={24} />
          </Button>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={currentPhoto.url}
              alt={`Foto ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-sm opacity-75">
              {index + 1} de {photos.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoLightbox;