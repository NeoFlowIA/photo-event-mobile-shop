import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Story {
  id: string;
  eventTitle: string;
  eventSlug: string;
  cover: string;
  photos: string[];
}

const stories: Story[] = [
  {
    id: 'story-1',
    eventTitle: 'Maratona da Beira Mar',
    eventSlug: 'maratona-internacional-de-sao-paulo',
    cover: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1200&fit=crop',
    ]
  },
  {
    id: 'story-2',
    eventTitle: 'Triatlo do Rio',
    eventSlug: 'triathlon-iron-kids',
    cover: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=1200&fit=crop',
    ]
  },
  {
    id: 'story-3',
    eventTitle: 'Surf das Dunas',
    eventSlug: 'campeonato-de-surf-itacoatiara',
    cover: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1537519769794-fcb5a5ba98e7?w=800&h=1200&fit=crop',
    ]
  },
  {
    id: 'story-4',
    eventTitle: 'Night Bike',
    eventSlug: '6-night-bike-crasa-motos',
    cover: 'https://images.unsplash.com/photo-1558618666-fbd1c5cd4c84?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1558618666-fbd1c5cd4c84?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=1200&fit=crop',
    ]
  },
];

const EventStories = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentPhotoIndex(0);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (!selectedStory) return;
    if (currentPhotoIndex < selectedStory.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      // Vai para o próximo story
      const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
      if (currentIndex < stories.length - 1) {
        setSelectedStory(stories[currentIndex + 1]);
        setCurrentPhotoIndex(0);
      } else {
        closeStory();
      }
    }
  };

  const prevPhoto = () => {
    if (!selectedStory) return;
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else {
      // Vai para o story anterior
      const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
      if (currentIndex > 0) {
        setSelectedStory(stories[currentIndex - 1]);
        setCurrentPhotoIndex(stories[currentIndex - 1].photos.length - 1);
      }
    }
  };

  return (
    <>
      <section className="py-8 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
            Eventos em Destaque
          </h2>
          <div className="flex justify-center items-center gap-6 overflow-x-auto pb-2">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => openStory(story)}
                className="flex flex-col items-center gap-2 group min-w-[80px]"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary p-[3px] animate-pulse">
                    <div className="w-full h-full rounded-full bg-background p-[3px]">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={story.cover}
                          alt={story.eventTitle}
                          className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-20 h-20" />
                </div>
                <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors max-w-[80px] truncate">
                  {story.eventTitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Modal */}
      <Dialog open={!!selectedStory} onOpenChange={closeStory}>
        <DialogContent className="max-w-full h-screen w-screen p-0 bg-black/95 border-none">
          {selectedStory && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Progress bars */}
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-4 z-20">
                {selectedStory.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        idx === currentPhotoIndex ? 'w-full' : idx < currentPhotoIndex ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20 mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStory.cover}
                    alt={selectedStory.eventTitle}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-white font-medium">
                    {selectedStory.eventTitle}
                  </span>
                </div>
                <button
                  onClick={closeStory}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Photo */}
              <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center">
                <img
                  src={selectedStory.photos[currentPhotoIndex]}
                  alt={`${selectedStory.eventTitle} - Foto ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                  onClick={nextPhoto}
                />
              </div>

              {/* Navigation */}
              <button
                onClick={prevPhoto}
                disabled={currentPhotoIndex === 0 && stories.findIndex(s => s.id === selectedStory.id) === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-20"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-3 transition-colors z-20"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* CTA */}
              <Link
                to={`/eventos/${selectedStory.eventSlug}`}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors z-20"
              >
                Ver todas as fotos
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventStories;
