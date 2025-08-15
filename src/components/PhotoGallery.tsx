import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EventPhoto } from '@/data/eventsMock';
import { useCart } from '@/hooks/useCart';
import PhotoLightbox from './PhotoLightbox';
import { toast } from '@/components/ui/use-toast';

interface PhotoGalleryProps {
  photos: EventPhoto[];
  eventId: string;
  eventTitle: string;
}

const PhotoGallery = ({ photos, eventId, eventTitle }: PhotoGalleryProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { addToCart, isInCart } = useCart();

  const toggleSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const addSelectedToCart = () => {
    let addedCount = 0;
    let duplicateCount = 0;

    selectedPhotos.forEach(photoId => {
      const photo = photos.find(p => p.id === photoId);
      if (photo) {
        if (addToCart(photo, eventId, eventTitle)) {
          addedCount++;
        } else {
          duplicateCount++;
        }
      }
    });

    if (addedCount > 0) {
      toast({
        title: `${addedCount} foto${addedCount > 1 ? 's' : ''} adicionada${addedCount > 1 ? 's' : ''} ao carrinho`,
        description: duplicateCount > 0 ? `${duplicateCount} já estavam no carrinho` : undefined,
      });
      setSelectedPhotos(new Set());
    } else if (duplicateCount > 0) {
      toast({
        title: "Todas as fotos já estão no carrinho",
        variant: "destructive",
      });
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          As fotos deste evento serão publicadas em breve
        </h3>
        <p className="text-gray-600">
          Fique atento para não perder as melhores imagens!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Selection Header */}
      {selectedPhotos.size > 0 && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedPhotos.size} foto{selectedPhotos.size > 1 ? 's' : ''} selecionada{selectedPhotos.size > 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPhotos(new Set())}
              >
                Limpar seleção
              </Button>
              <Button
                size="sm"
                onClick={addSelectedToCart}
                className="bg-primary hover:bg-primary/90"
              >
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative group">
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedPhotos.has(photo.id)}
                onCheckedChange={() => toggleSelection(photo.id)}
                className="bg-white/80 border-white shadow-sm"
              />
            </div>

            {/* Cart Status */}
            {isInCart(photo.id) && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  No carrinho
                </div>
              </div>
            )}

            {/* Photo */}
            <div
              className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-gray-100"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.thumb}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                R$ {photo.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
      />
    </div>
  );
};

export default PhotoGallery;