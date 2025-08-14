import { Button } from '@/components/ui/button';

const ContactCTA = () => {
  return (
    <section className="py-16 bg-gray-100/50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl p-6 lg:p-8 grid lg:grid-cols-2 gap-6 shadow-sm">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Precisa de um fotógrafo?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Você necessita de um fotógrafo para melhorar as vendas, quer registrar um momento especial ou quer nos contratar para cobrir seu evento? Na Olha a Foto você encontra um serviço de extrema qualidade para registrar cada emoção
            </p>
            <Button 
              size="lg"
              className="bg-[#E03A3A] hover:bg-red-600 text-white px-8"
            >
              Entrar em contato
            </Button>
          </div>
          
          <div className="relative">
            {/* Decorative images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop" 
                  alt="Fotografia profissional" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop" 
                  alt="Evento fotografado" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;