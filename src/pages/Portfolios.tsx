import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '@/components/TopBar';
import PhotographerProfileDrawer from '@/components/PhotographerProfileDrawer';
import photographersData from '@/data/photographers.json';
import { cn } from '@/lib/utils';

type SpotlightPhotographer = {
  id: string;
  name: string;
  handle: string;
  image: string;
  spotlight?: boolean;
};

type PortfolioPhotographer = SpotlightPhotographer & {
  city: string;
  category: string;
  rating: string;
  specialty: string;
  description: string;
  portfolio: string[];
};

const ITEMS_PER_PAGE = 12;

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  id?: string;
};

const SectionHeader = ({ title, subtitle, id }: SectionHeaderProps) => (
  <div className="mx-auto max-w-3xl text-center">
    <h1 id={id} className="text-3xl font-bold tracking-tight text-[#0A1F44] md:text-4xl">
      {title}
    </h1>
    <p className="mt-4 text-lg text-[#4A5A7F]">{subtitle}</p>
  </div>
);

type PhotographerCardProps = {
  photographer: PortfolioPhotographer;
  onViewProfile?: (photographer: PortfolioPhotographer) => void;
};

const PhotographerCard = ({ photographer, onViewProfile }: PhotographerCardProps) => (
  <Card
    className={cn(
      'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300',
      'hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#006CFF] focus-visible:outline-none'
    )}
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={photographer.image}
        alt={`Portfólio de ${photographer.name}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/400x300/EEF2FF/0A1F44?text=${encodeURIComponent(photographer.name)}`;
        }}
      />
    </div>

    <CardContent className="flex flex-1 flex-col gap-4 p-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-[#0A1F44]">{photographer.name}</h3>
          <Badge className="rounded-full border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1 text-xs font-medium text-[#006CFF]">
            {photographer.city}
          </Badge>
        </div>
        <p className="text-sm text-[#4A5A7F]">{photographer.specialty || photographer.category}</p>
      </div>

      {onViewProfile && (
        <div className="mt-auto">
          <Button
            variant="link"
            onClick={() => onViewProfile(photographer)}
            className="p-0 text-base font-semibold text-[#006CFF] transition-colors hover:text-[#0047B3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006CFF]"
          >
            Ver perfil
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

type PhotographersGridProps = {
  photographers: PortfolioPhotographer[];
  onViewProfile?: (photographer: PortfolioPhotographer) => void;
};

const PhotographersGrid = ({ photographers, onViewProfile }: PhotographersGridProps) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {photographers.map((photographer) => (
      <PhotographerCard key={photographer.id} photographer={photographer} onViewProfile={onViewProfile} />
    ))}
  </div>
);

// Generate additional mock photographers to have 24 total
const generateMockPhotographers = (): PortfolioPhotographer[] => {
  const cities = ['Fortaleza, CE', 'Recife, PE', 'Brasília, DF', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG'];
  const categories = ['Corrida de rua', 'Triathlon', 'Ciclismo', 'Show', 'Casamento', 'Corporativo'];
  const names = ['Carlos Lima', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'José Silva', 'Paula Ferreira', 'Bruno Alves', 'Camila Rocha', 'Rafael Souza', 'Luciana Mendes'];

  const basePhotographers = photographersData as SpotlightPhotographer[];
  const additionalPhotographers: PortfolioPhotographer[] = [];
  for (let i = 0; i < 20; i++) {
    additionalPhotographers.push({
      id: String(basePhotographers.length + i + 1),
      name: names[i % names.length] + ` ${i + 1}`,
      handle: `@foto${i + 1}`,
      image: `https://images.unsplash.com/photo-${1517841905240 + i}?w=300&h=300&fit=crop&auto=format`,
      city: cities[i % cities.length],
      category: categories[i % categories.length],
      rating: (4.2 + Math.random() * 0.8).toFixed(1),
      specialty: categories[i % categories.length],
      description: `Fotógrafo especializado em ${categories[i % categories.length].toLowerCase()} com experiência profissional e equipamentos de alta qualidade.`,
      portfolio: [
        `https://images.unsplash.com/photo-${1551698618000 + i}?w=300&h=300&fit=crop`,
        `https://images.unsplash.com/photo-${1594736797000 + i}?w=300&h=300&fit=crop`,
        `https://images.unsplash.com/photo-${1611270629000 + i}?w=300&h=300&fit=crop`
      ]
    });
  }
  
  return [
    ...basePhotographers.map((p, index) => ({
      ...p,
      city: cities[index % cities.length],
      category: categories[index % categories.length],
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
    specialty: categories[index % categories.length],
    description: `Fotógrafo especializado em ${categories[index % categories.length].toLowerCase()} com experiência profissional.`,
    portfolio: [
      `https://images.unsplash.com/photo-${1551698618000 + index}?w=300&h=300&fit=crop`,
      `https://images.unsplash.com/photo-${1594736797000 + index}?w=300&h=300&fit=crop`,
      `https://images.unsplash.com/photo-${1611270629000 + index}?w=300&h=300&fit=crop`
    ]
  })), ...additionalPhotographers];
};

const Portfolios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photographers] = useState<PortfolioPhotographer[]>(generateMockPhotographers());
  const [filteredPhotographers, setFilteredPhotographers] = useState<PortfolioPhotographer[]>(photographers);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState(searchParams.get('cidade') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoria') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState<PortfolioPhotographer | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = photographers;

    if (cityFilter) {
      filtered = filtered.filter((p) => p.city.includes(cityFilter));
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPhotographers(filtered);
    setCurrentPage(1);
  }, [cityFilter, categoryFilter, searchQuery, photographers]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (cityFilter) params.set('cidade', cityFilter);
    if (categoryFilter) params.set('categoria', categoryFilter);
    setSearchParams(params);
  }, [cityFilter, categoryFilter, setSearchParams]);

  const totalPages = Math.ceil(filteredPhotographers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPhotographers = filteredPhotographers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const cities = ['Fortaleza', 'Recife', 'Brasília', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];
  const categories = ['Corrida de rua', 'Triathlon', 'Ciclismo', 'Show', 'Casamento', 'Corporativo'];

  const handleViewProfile = (photographer: PortfolioPhotographer) => {
    setSelectedPhotographer(photographer);
    setShowDrawer(true);
  };

  const clearFilters = () => {
    setCityFilter('');
    setCategoryFilter('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F7FB] via-white to-white">
      <TopBar />

      <main className="container mx-auto px-4 py-12">
        <section aria-labelledby="photographers-section" className="space-y-10">
          <SectionHeader
            id="photographers-section"
            title="Conheça Nossos Fotógrafos"
            subtitle="Explore o portfólio de profissionais"
          />

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5A7F]"
                  size={16}
                  aria-hidden
                />
                <Input
                  placeholder="Buscar por nome ou @handle"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-white pl-10 text-[#0A1F44] focus-visible:ring-2 focus-visible:ring-[#006CFF]"
                />
              </div>

              <Select value={cityFilter} onValueChange={(value) => setCityFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white text-[#0A1F44] focus:ring-2 focus:ring-[#006CFF]">
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white text-[#0A1F44] focus:ring-2 focus:ring-[#006CFF]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12 rounded-2xl border-[#006CFF]/20 bg-white text-[#006CFF] transition-colors hover:bg-[#006CFF]/10 hover:text-[#0047B3] focus-visible:ring-2 focus-visible:ring-[#006CFF]"
              >
                Limpar filtros
              </Button>
            </div>
          </div>

          <p className="text-sm text-[#4A5A7F]">
            {filteredPhotographers.length} fotógrafo{filteredPhotographers.length !== 1 ? 's' : ''} encontrado{filteredPhotographers.length !== 1 ? 's' : ''}
          </p>

          <PhotographersGrid
            photographers={currentPhotographers}
            onViewProfile={handleViewProfile}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full border-[#006CFF]/20 bg-white px-6 text-[#006CFF] transition-colors hover:bg-[#006CFF]/10 hover:text-[#0047B3] focus-visible:ring-2 focus-visible:ring-[#006CFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft size={16} className="mr-1" />
                Anterior
              </Button>

              <span className="text-sm font-medium text-[#0A1F44]">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border-[#006CFF]/20 bg-white px-6 text-[#006CFF] transition-colors hover:bg-[#006CFF]/10 hover:text-[#0047B3] focus-visible:ring-2 focus-visible:ring-[#006CFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Próxima
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </section>
      </main>

      <PhotographerProfileDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        photographer={selectedPhotographer}
      />
    </div>
  );
};

export default Portfolios;