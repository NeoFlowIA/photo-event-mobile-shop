import { createEventSlug } from '@/lib/slugify';
import eventsData from './events.json';

export interface EventPhoto {
  id: string;
  url: string;
  thumb: string;
  price: number;
}

export interface EventAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface EventDetail {
  id: string;
  slug: string;
  title: string;
  city: string;
  date: string;
  venue: string;
  author: EventAuthor;
  cover: string;
  category: string;
  photos: EventPhoto[];
  description?: string;
  time?: string;
  policy?: string;
  resolution?: string;
}

// Mock photos generator
const generateMockPhotos = (eventId: string, count: number = 24): EventPhoto[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${eventId}-photo-${i + 1}`,
    url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=600&fit=crop`,
    thumb: `https://images.unsplash.com/photo-${1500000000000 + i}?w=300&h=200&fit=crop`,
    price: 19.9
  }));
};

// Convert original events data to detailed format
export const eventsDetailsMock: EventDetail[] = eventsData.map((event) => ({
  id: event.id,
  slug: createEventSlug(event.title),
  title: event.title,
  city: event.city,
  date: event.date,
  venue: event.venue,
  author: {
    name: event.handle.replace('@', '').replace('.', ' ').toUpperCase(),
    handle: event.handle,
    avatar: `https://images.unsplash.com/photo-${1400000000000 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop&crop=face`
  },
  cover: event.image,
  category: getCategoryFromTitle(event.title),
  photos: generateMockPhotos(event.id),
  description: `Cobertura fotográfica completa do evento ${event.title}`,
  time: "Das 08:00 às 18:00",
  policy: "Uso pessoal liberado. Para uso comercial, entre em contato.",
  resolution: "Alta resolução (300 DPI)"
}));

function getCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('bike') || titleLower.includes('ciclismo')) return 'Ciclismo';
  if (titleLower.includes('natação') || titleLower.includes('swimming')) return 'Natação';
  if (titleLower.includes('futebol') || titleLower.includes('football')) return 'Futebol';
  if (titleLower.includes('maratona') || titleLower.includes('corrida')) return 'Corrida';
  if (titleLower.includes('triathlon')) return 'Triathlon';
  if (titleLower.includes('festival') || titleLower.includes('música')) return 'Festival';
  if (titleLower.includes('crossfit')) return 'CrossFit';
  if (titleLower.includes('surf')) return 'Surf';
  if (titleLower.includes('tênis') || titleLower.includes('tennis')) return 'Tênis';
  if (titleLower.includes('vôlei') || titleLower.includes('volleyball')) return 'Vôlei';
  return 'Esporte';
}

export const getEventBySlug = (slug: string): EventDetail | null => {
  return eventsDetailsMock.find(event => event.slug === slug) || null;
};

export const getEventById = (id: string): EventDetail | null => {
  return eventsDetailsMock.find(event => event.id === id) || null;
};

export const getRelatedEvents = (currentEventId: string, limit: number = 6): EventDetail[] => {
  return eventsDetailsMock
    .filter(event => event.id !== currentEventId)
    .slice(0, limit);
};