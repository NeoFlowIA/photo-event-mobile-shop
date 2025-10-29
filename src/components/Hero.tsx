import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
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

type AutoplayType = ReturnType<typeof Autoplay>;
const MotionButton = motion(Button);

const floatingDecorations = [
  {
    id: 'left-main',
    className:
      'hidden xl:block absolute -left-16 top-28 w-44 rounded-3xl border-4 border-white/40 shadow-2xl overflow-hidden rotate-[-10deg] backdrop-blur-sm',
    src: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
    alt: 'Fotógrafo registrando casal ao ar livre',
    delay: 0,
  },
  {
    id: 'left-secondary',
    className:
      'hidden lg:block absolute -left-10 bottom-32 w-36 rounded-3xl border-4 border-white/40 shadow-xl overflow-hidden rotate-6',
    src: 'https://images.unsplash.com/photo-1487412720507-7f0c8b5a8cfe?auto=format&fit=crop&w=420&q=80',
    alt: 'Detalhes de câmera profissional',
    delay: 1.2,
  },
  {
    id: 'right-main',
    className:
      'hidden xl:block absolute -right-20 top-24 w-48 rounded-3xl border-4 border-white/40 shadow-2xl overflow-hidden rotate-6',
    src: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=500&q=80',
    alt: 'Plateia animada em festival noturno',
    delay: 0.6,
  },
  {
    id: 'right-secondary',
    className:
      'hidden lg:block absolute -right-6 bottom-24 w-36 rounded-3xl border-4 border-white/40 shadow-xl overflow-hidden rotate-[-6deg]',
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=420&q=80',
    alt: 'Noivos celebrando com convidados',
    delay: 1.8,
  },
];

const Hero = () => {
  const { user } = useAuth();
  const [, setSelectedFile] = useState<File | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'selfie' | null>(null);
  const autoplay = useRef<AutoplayType>(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const handleFindEventClick = () => {
    if (typeof document === 'undefined') return;

    const section = document.querySelector('#marketplace-event-search');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      const input = document.getElementById('marketplace-event-search-input') as HTMLInputElement | null;
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
    <section className="relative overflow-hidden bg-[var(--brand-secondary)] pb-24 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--brand-secondary)] via-[var(--brand-secondary)]/95 to-[#051229]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70rem] -translate-x-1/2 rounded-full bg-[var(--brand-accent)]/20 blur-3xl" />

      {floatingDecorations.map((decoration) => (
        <motion.div
          key={decoration.id}
          className={`${decoration.className} animate-float`}
          aria-hidden="true"
          animate={{ y: [0, -18, 0] }}
          transition={{ delay: decoration.delay, duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src={decoration.src} alt={decoration.alt} className="h-full w-full object-cover" />
        </motion.div>
      ))}

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-8 sm:px-16 lg:px-24">
        <div className="relative">
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay.current]}
            className="group relative"
            onMouseLeave={() => autoplay.current?.reset?.()}
          >
            <CarouselContent>
              {heroHighlights.map((highlight) => (
                <CarouselItem key={highlight.id}>
                  <article className="relative h-[420px] overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(5,18,41,0.6)]">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#040B1A]/95 via-[#040B1A]/80 to-transparent" />
                    <motion.div
                      key={highlight.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="relative flex h-full flex-col justify-center gap-5 p-8 md:p-12"
                    >
                      <span className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
                        {highlight.badge}
                      </span>
                      <h1 className="max-w-2xl font-['Poppins',_sans-serif] text-3xl font-extrabold leading-tight md:text-5xl">
                        {highlight.title}
                      </h1>
                      <p className="max-w-2xl text-base text-white/80 md:text-lg">
                        {highlight.description}
                      </p>
                      <Button
                        asChild
                        variant="secondary"
                        className="w-fit rounded-full border border-white/30 bg-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
                      >
                        <a href={highlight.ctaLink}>{highlight.ctaLabel}</a>
                      </Button>
                    </motion.div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              aria-label="Slide anterior"
              className="left-6 hidden h-11 w-11 items-center justify-center rounded-full border-none bg-white/85 text-[var(--brand-secondary)] shadow-lg transition hover:bg-white lg:flex"
            />
            <CarouselNext
              aria-label="Próximo slide"
              className="right-6 hidden h-11 w-11 items-center justify-center rounded-full border-none bg-white/85 text-[var(--brand-secondary)] shadow-lg transition hover:bg-white lg:flex"
            />
          </Carousel>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MotionButton
            onClick={() => setShowHireModal(true)}
            className="w-full rounded-full bg-[var(--brand-primary)] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#d93429] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)] sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Montar meu pacote
          </MotionButton>
          <Button
            onClick={handleFindEventClick}
            size="lg"
            className="w-full rounded-full border border-white/25 bg-white/10 text-white backdrop-blur px-8 py-3 text-base font-medium transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            Encontrar evento pelo nome
          </Button>
        </div>

        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/95 p-6 text-[var(--brand-secondary)] shadow-xl backdrop-blur">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex w-full flex-1 items-center gap-3">
              <button
                onClick={handleCameraClick}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-accent)] text-[var(--brand-secondary)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)]"
                aria-label="Enviar selfie"
              >
                <Camera size={22} />
              </button>
              <Input
                placeholder="Envie uma selfie para encontrar suas fotos"
                className="h-12 flex-1 border-none bg-transparent px-0 text-base text-[var(--brand-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
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
              className="w-full rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d93429] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)] sm:w-auto"
            >
              Enviar foto
            </Button>
          </div>
          {searchMessage && (
            <div className="mt-3 rounded-xl bg-emerald-50/90 px-4 py-2 text-sm font-medium text-emerald-700">
              {searchMessage}
            </div>
          )}
        </div>
      </div>

      <CpfModal open={showCpfModal} onClose={() => setShowCpfModal(false)} onConfirm={handleCpfConfirm} />

      <HirePhotographerModal open={showHireModal} onClose={() => setShowHireModal(false)} />
    </section>
  );
};

export default Hero;
