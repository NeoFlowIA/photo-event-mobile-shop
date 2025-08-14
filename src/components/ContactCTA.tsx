import { Button } from '@/components/ui/button';

const ContactCTA = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Precisa de um fotógrafo?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Você necessita de um fotógrafo para melhorar as vendas, quer registrar um momento especial ou quer nos contratar para cobrir seu evento? Na Olha a Foto você encontra um serviço de extrema qualidade para registrar cada emoção
            </p>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Entrar em contato
            </Button>
          </div>
          
          <div className="relative">
            {/* Decorative image placeholders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-2xl"></div>
              <div className="aspect-square bg-muted rounded-2xl mt-8"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;