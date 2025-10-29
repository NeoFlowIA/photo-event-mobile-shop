import { useState } from 'react';
import TopBar from '@/components/TopBar';
import HeroCarousel from '@/components/HeroCarousel';
import EventStories from '@/components/EventStories';
import SearchBar from '@/components/SearchBar';
import EventsGrid from '@/components/EventsGrid';
import HowItWorks from '@/components/HowItWorks';
import PhotographersSpotlight from '@/components/PhotographersSpotlight';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const handleSearch = (query: string, city: string) => {
    setSearchQuery(query);
    setCityFilter(city);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>
        <HeroCarousel />
        <EventStories />
        <SearchBar onSearch={handleSearch} onSortChange={handleSortChange} />
        <EventsGrid 
          searchQuery={searchQuery}
          cityFilter={cityFilter}
          sortBy={sortBy}
        />
        <HowItWorks />
        <PhotographersSpotlight />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;