import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselSlide {
  id: number;
  titulo: string;
  imagem: string;
  descricao: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    titulo: "Pacotes promocionais para organizadores",
    descricao: "Escolha cobertura completa com fotógrafos especializados para o seu evento.",
    imagem: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=800&fit=crop"
  },
  {
    id: 2,
    titulo: "Shows e eventos ao vivo",
    descricao: "Capture cada momento inesquecível com profissionais experientes.",
    imagem: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop"
  },
  {
    id: 3,
    titulo: "Casamentos e celebrações",
    descricao: "Eternize seu grande dia com fotografia de alta qualidade.",
    imagem: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=800&fit=crop"
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.imagem}
              alt={currentSlide.titulo}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-8 sm:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto text-center text-white">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {currentSlide.titulo}
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl mb-10 text-white/90 max-w-3xl mx-auto"
              >
                {currentSlide.descricao}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-2xl transition-all"
                  onClick={() => {
                    const element = document.querySelector('#encontrar-fotografo');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Montar meu pacote
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full h-12 w-12 transition-all"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full h-12 w-12 transition-all"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating Decorative Images - Left */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 w-32 space-y-6 pointer-events-none">
        <motion.div 
          className="w-24 h-28 rounded-2xl shadow-2xl overflow-hidden animate-float"
          style={{ '--rotate-start': '12deg', '--rotate-end': '18deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=240&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div 
          className="w-28 h-24 rounded-2xl shadow-2xl overflow-hidden animate-float-delay-1"
          style={{ '--rotate-start': '-8deg', '--rotate-end': '-14deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=240&h=200&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div 
          className="w-20 h-26 rounded-2xl shadow-2xl overflow-hidden animate-float-delay-2"
          style={{ '--rotate-start': '5deg', '--rotate-end': '10deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=180&h=220&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Floating Decorative Images - Right */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-32 space-y-6 pointer-events-none">
        <motion.div 
          className="w-28 h-32 rounded-2xl shadow-2xl overflow-hidden animate-float-delay-1"
          style={{ '--rotate-start': '-12deg', '--rotate-end': '-18deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=240&h=280&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div 
          className="w-24 h-28 rounded-2xl shadow-2xl overflow-hidden animate-float"
          style={{ '--rotate-start': '10deg', '--rotate-end': '16deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&h=240&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div 
          className="w-30 h-24 rounded-2xl shadow-2xl overflow-hidden animate-float-delay-2"
          style={{ '--rotate-start': '-6deg', '--rotate-end': '-12deg' } as React.CSSProperties}
        >
          <img 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=260&h=200&fit=crop&crop=faces" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCarousel;
