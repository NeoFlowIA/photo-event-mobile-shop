import { useState } from 'react';
import { Camera, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { heroHighlights } from '@/data/heroHighlights';
import { useAuth } from '@/contexts/AuthContext';
import CpfModal from './CpfModal';
import HirePhotographerModal from './HirePhotographerModal';

const Hero = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'selfie' | null>(null);

  const handleFindEventClick = () => {
    if (typeof document === 'undefined') return;

    const section = document.querySelector('#marketplace-event-search');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      const input = document.getElementById(
        'marketplace-event-search-input',
      ) as HTMLInputElement | null;
      input?.focus();
    }, 600);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processSelfieSearch();
    }
  };

  const handleCameraClick = () => {
    if (!user?.cpf) {
      setPendingAction('selfie');
      setShowCpfModal(true);
      return;
    }
    document.getElementById('selfie-upload')?.click();
  };

  const processSelfieSearch = () => {
    setSearchMessage('📸 Foto enviada! Estamos procurando suas fotos... (mock)');
    setTimeout(() => setSearchMessage(''), 3000);
  };

  const handleCpfConfirm = () => {
    if (pendingAction === 'selfie') {
      document.getElementById('selfie-upload')?.click();
    }
    setPendingAction(null);
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Decorative images - desktop only */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-20 h-24 rounded-xl rotate-12 opacity-80 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150&h=180&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-24 h-20 rounded-xl -rotate-6 opacity-70 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=180&h=150&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-18 h-22 rounded-xl rotate-3 opacity-75 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=135&h=165&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
      
      <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-24 h-28 rounded-xl -rotate-12 opacity-80 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=180&h=210&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-20 h-24 rounded-xl rotate-6 opacity-70 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=150&h=180&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-26 h-20 rounded-xl -rotate-3 opacity-75 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=195&h=150&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{ loop: true }}
            className="relative mb-8"
          >
            <CarouselContent>
              {heroHighlights.map((highlight) => (
                <CarouselItem key={highlight.id}>
                  <div className="group relative h-[360px] overflow-hidden rounded-2xl bg-black text-left shadow-2xl">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
                    <div className="relative flex h-full flex-col justify-center gap-4 p-8 text-white">
                      <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/90">
                        Marketplace
                      </span>
                      <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                        {highlight.title}
                      </h1>
                      <p className="max-w-xl text-sm md:text-base text-white/80">
                        {highlight.description}
                      </p>
                      <div>
                        <Button
                          asChild
                          className="bg-[var(--brand-primary)] hover:bg-[#CC3434] text-white"
                        >
                          <a href={highlight.ctaLink}>{highlight.ctaLabel}</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-6 hidden h-10 w-10 bg-white/90 text-[var(--brand-primary)] shadow-lg backdrop-blur-sm transition-all hover:bg-white lg:flex" />
            <CarouselNext className="right-6 hidden h-10 w-10 bg-white/90 text-[var(--brand-primary)] shadow-lg backdrop-blur-sm transition-all hover:bg-white lg:flex" />
          </Carousel>

          <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => setShowHireModal(true)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-[var(--brand-stroke)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 hover:text-[#CC3434]"
            >
              Quero contratar um fotógrafo
            </Button>
            <Button
              onClick={handleFindEventClick}
              size="lg"
              className="w-full sm:w-auto bg-[var(--brand-primary)] text-white hover:bg-[#CC3434]"
            >
              <Search className="mr-2 h-4 w-4" />
              Encontrar evento pelo nome
            </Button>
          </div>

          {/* Selfie Match Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-[var(--brand-surface)] rounded-xl shadow-md px-4 py-3 flex flex-col sm:flex-row items-center gap-3 text-[var(--brand-text)]">
              <div className="flex items-center gap-3 w-full sm:flex-1">
                <button 
                  onClick={handleCameraClick}
                  className="flex-shrink-0 text-[#6B7280] hover:text-[var(--brand-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary)]"
                  aria-label="Enviar selfie"
                >
                  <Camera size={22} />
                </button>
                <Input
                  placeholder="Envie uma selfie para encontrar suas fotos"
                  className="border-0 bg-transparent flex-1 text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  readOnly
                  onClick={handleCameraClick}
                />
                <input
                  id="selfie-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <Button 
                onClick={handleCameraClick}
                className="bg-[var(--brand-primary)] hover:bg-[#CC3434] text-white rounded-lg px-4 py-2 w-full sm:w-auto whitespace-nowrap focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                Enviar foto
              </Button>
            </div>
            {searchMessage && (
              <div className="mt-3 p-2 text-sm text-green-600 font-medium bg-green-50 rounded-lg">
                {searchMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CpfModal
        open={showCpfModal}
        onClose={() => setShowCpfModal(false)}
        onConfirm={handleCpfConfirm}
      />
      
      <HirePhotographerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
      />
    </section>
  );
};

export default Hero;