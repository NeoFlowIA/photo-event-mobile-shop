import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, city: string) => void;
  onSortChange: (sort: string) => void;
}

const SearchBar = ({ onSearch, onSortChange }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery, selectedCity);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar e explorar eventos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 rounded-xl px-4 py-2"
                aria-label="Pesquisar eventos"
              />
            </div>
            
            <div className="w-full lg:w-48">
              <Select onValueChange={setSelectedCity} aria-label="Selecionar cidade">
                <SelectTrigger className="h-12 rounded-xl px-4 py-2">
                  <SelectValue placeholder="Cidade ▾" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  <SelectItem value="fortaleza">Fortaleza - CE</SelectItem>
                  <SelectItem value="sao-paulo">São Paulo - SP</SelectItem>
                  <SelectItem value="rio-de-janeiro">Rio de Janeiro - RJ</SelectItem>
                  <SelectItem value="salvador">Salvador - BA</SelectItem>
                  <SelectItem value="belo-horizonte">Belo Horizonte - MG</SelectItem>
                  <SelectItem value="brasilia">Brasília - DF</SelectItem>
                  <SelectItem value="recife">Recife - PE</SelectItem>
                  <SelectItem value="niteroi">Niterói - RJ</SelectItem>
                  <SelectItem value="campos-do-jordao">Campos do Jordão - SP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 bg-[#E03A3A] hover:bg-red-600 text-white rounded-xl"
              aria-label="Pesquisar eventos"
            >
              <Search size={18} className="mr-2" />
              Pesquisar
            </Button>
            
            <div className="w-full lg:w-48">
              <Select onValueChange={onSortChange} aria-label="Ordenar por">
                <SelectTrigger className="h-12 rounded-xl px-4 py-2">
                  <SelectValue placeholder="Ordenar por ▾" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                  <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;