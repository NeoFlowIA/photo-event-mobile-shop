export interface HeroHighlight {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
}

export const heroHighlights: HeroHighlight[] = [
  {
    id: 'promo-parceiros',
    title: 'Vitrine de parceiros certificados',
    description:
      'Descubra fornecedores exclusivos com condições especiais para o seu próximo evento.',
    image:
      'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1600&h=900&fit=crop&auto=format',
    ctaLabel: 'Conhecer parceiros',
    ctaLink: '#parceiros-destaque',
  },
  {
    id: 'eventos-destaque',
    title: 'Eventos imperdíveis desta semana',
    description:
      'Garanta suas fotos oficiais nos eventos mais aguardados do marketplace.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&fit=crop&auto=format',
    ctaLabel: 'Explorar eventos',
    ctaLink: '#eventos-destaque',
  },
  {
    id: 'promo-pacotes',
    title: 'Pacotes promocionais para organizadores',
    description:
      'Negocie cobertura completa com fotógrafos especializados para o seu evento.',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&h=900&fit=crop&auto=format',
    ctaLabel: 'Montar meu pacote',
    ctaLink: '#pacotes-organizadores',
  },
];
