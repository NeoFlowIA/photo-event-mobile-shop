import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import photographersData from '@/data/photographers.json';
import PhotographerProfileDrawer from './PhotographerProfileDrawer';
import HirePhotographerModal from './HirePhotographerModal';

const PhotographersSpotlight = () => {
  const navigate = useNavigate();
  const spotlightPhotographers = photographersData.filter(p => p.spotlight);
  const [selectedPhotographer, setSelectedPhotographer] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);

  const handleViewProfile = (photographer: any) => {
    // Add portfolio and additional info for the drawer
    const fullPhotographer = {
      ...photographer,
      city: "Fortaleza, CE",
      rating: 4.8,
      specialty: "Eventos esportivos",
      description: `Especialista em fotografias de eventos esportivos com mais de 5 anos de experiência. Capturo os momentos mais emocionantes com técnica profissional e equipamentos de ponta.`,
      portfolio: [
        `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop`,
        `https://images.unsplash.com/photo-1594736797933-d0302b35c9c0?w=300&h=300&fit=crop`,
        `https://images.unsplash.com/photo-1611270629081-d53b4f34daa6?w=300&h=300&fit=crop`
      ]
    };
    setSelectedPhotographer(fullPhotographer);
    setShowDrawer(true);
  };

  return (
    <section id="encontrar-fotografo" className="py-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand-secondary)] mb-4">
            Encontrar um fotógrafo
          </h2>
          <p className="text-lg text-[var(--brand-muted)] max-w-2xl mx-auto">
            Escolha um de nossos especialistas para registrar seu evento!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {spotlightPhotographers.map((photographer) => (
            <Card key={photographer.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={photographer.image}
                  alt={`Fotógrafo ${photographer.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/300x300/E03A3A/FFFFFF?text=${encodeURIComponent(photographer.name)}`;
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] border border-[var(--brand-accent)]/30 px-2 py-1 rounded-md font-medium">
                    Em destaque
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-lg mb-1 text-[var(--brand-secondary)]">
                  {photographer.name}
                </h3>
                <p className="text-sm text-[var(--brand-muted)] mb-4">
                  {photographer.handle}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewProfile(photographer)}
                  className="w-full text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5 focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  Ver perfil
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/portfolios')}
              className="text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5 focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              Ver todos os portfólios
            </Button>
            <Button 
              onClick={() => setShowHireModal(true)}
              size="lg"
              className="bg-[var(--brand-primary)] hover:bg-[#CC3434] text-white focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              Solicitar orçamento
            </Button>
          </div>
        </div>
      </div>
      
      <PhotographerProfileDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        photographer={selectedPhotographer}
      />
      
      <HirePhotographerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
      />
    </section>
  );
};

export default PhotographersSpotlight;