export interface HeroHighlight {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
}

export const heroHighlights: HeroHighlight[] = [
  {
    id: 'pacotes-organizadores',
    badge: 'Oferta exclusiva',
    title: 'Pacotes promocionais para organizadores',
    description:
      'Escolha cobertura completa com fotógrafos especializados para o seu evento corporativo ou social.',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Ver pacotes disponíveis',
    ctaLink: '#pacotes-organizadores',
  },
  {
    id: 'casamentos',
    badge: 'Casamentos',
    title: 'Registre cada momento do "sim"',
    description:
      'Monte seu time de fotógrafos para garantir um álbum inesquecível do grande dia.',
    image:
      'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Explorar fotógrafos de casamento',
    ctaLink: '#casamentos',
  },
  {
    id: 'shows-eventos',
    badge: 'Shows e eventos',
    title: 'Cobertura profissional para grandes palcos',
    description:
      'Equipe experiente para festivais, feiras e congressos, com entrega rápida das imagens.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Conhecer especialistas em eventos',
    ctaLink: '#shows-eventos',
  },
];
