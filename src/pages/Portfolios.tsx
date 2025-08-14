import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '@/components/TopBar';
import PhotographerProfileDrawer from '@/components/PhotographerProfileDrawer';
import HirePhotographerModal from '@/components/HirePhotographerModal';
import photographersData from '@/data/photographers.json';

const ITEMS_PER_PAGE = 12;

// Generate additional mock photographers to have 24 total
const generateMockPhotographers = () => {
  const cities = ['Fortaleza, CE', 'Recife, PE', 'Brasília, DF', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG'];
  const categories = ['Corrida de rua', 'Triathlon', 'Ciclismo', 'Show', 'Casamento', 'Corporativo'];
  const names = ['Carlos Lima', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'José Silva', 'Paula Ferreira', 'Bruno Alves', 'Camila Rocha', 'Rafael Souza', 'Luciana Mendes'];
  
  const additionalPhotographers = [];
  for (let i = 0; i < 20; i++) {
    additionalPhotographers.push({
      id: photographersData.length + i + 1,
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
  
  return [...photographersData.map((p, index) => ({
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
  const [photographers] = useState(generateMockPhotographers());
  const [filteredPhotographers, setFilteredPhotographers] = useState(photographers);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState(searchParams.get('cidade') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoria') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotographer, setSelectedPhotographer] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = photographers;

    if (cityFilter) {
      filtered = filtered.filter(p => p.city.includes(cityFilter));
    }

    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
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

  const handleViewProfile = (photographer: any) => {
    setSelectedPhotographer(photographer);
    setShowDrawer(true);
  };

  const clearFilters = () => {
    setCityFilter('');
    setCategoryFilter('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg)]">
      <TopBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-secondary)] mb-4">
            Portfólios de fotógrafos
          </h1>
          <p className="text-lg text-[var(--brand-muted)] mb-6">
            Descubra fotógrafos especializados e contrate o profissional ideal para seu evento
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={() => setShowHireModal(true)}
            size="lg"
            className="bg-[var(--brand-primary)] hover:bg-[#CC3434] text-white focus:ring-2 focus:ring-[var(--brand-primary)] mb-8"
          >
            Solicitar orçamento
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--brand-surface)] rounded-xl border border-[var(--brand-stroke)] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brand-muted)]" size={16} />
              <Input
                placeholder="Buscar por nome ou @handle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--brand-surface)] border-[var(--brand-stroke)] rounded-xl text-[var(--brand-text)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              />
            </div>

            {/* City Filter */}
            <Select value={cityFilter} onValueChange={(value) => setCityFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className="bg-[var(--brand-surface)] border-[var(--brand-stroke)] rounded-xl text-[var(--brand-text)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className="bg-[var(--brand-surface)] border-[var(--brand-stroke)] rounded-xl text-[var(--brand-text)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5 focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-[var(--brand-muted)]">
            {filteredPhotographers.length} fotógrafo{filteredPhotographers.length !== 1 ? 's' : ''} encontrado{filteredPhotographers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Photographers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentPhotographers.map((photographer) => (
            <Card key={photographer.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-[var(--brand-surface)] border border-[var(--brand-stroke)]">
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
                  <span className="text-xs bg-white/85 backdrop-blur text-[var(--brand-secondary)] border border-[var(--brand-stroke)] px-2 py-1 rounded-md font-medium">
                    {photographer.handle}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] border border-[var(--brand-accent)]/30 px-2 py-1 rounded-md font-medium">
                    ⭐ {photographer.rating}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-[var(--brand-secondary)]">
                  {photographer.name}
                </h3>
                <p className="text-sm text-[var(--brand-muted)] mb-1">
                  {photographer.city}
                </p>
                <p className="text-xs text-[var(--brand-muted)] mb-4">
                  {photographer.category}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5 focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              <ChevronLeft size={16} className="mr-1" />
              Anterior
            </Button>
            
            <span className="text-[var(--brand-text)]">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5 focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              Próxima
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <PhotographerProfileDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        photographer={selectedPhotographer}
      />
      
      <HirePhotographerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
      />
    </div>
  );
};

export default Portfolios;