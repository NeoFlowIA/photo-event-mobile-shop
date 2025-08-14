import { Search, Camera, ShoppingCart, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: <Search size={32} />,
      title: "Selecione o evento",
      description: "Escolha um evento que você tenha participado"
    },
    {
      number: 2,
      icon: <Camera size={32} />,
      title: "Tire uma selfie ou envie uma foto sua",
      description: "Utilize nosso reconhecimento facial para encontrar suas fotos"
    },
    {
      number: 3,
      icon: <ShoppingCart size={32} />,
      title: "Adicione as fotos ao carrinho",
      description: "Selecione e adicione ao carrinho suas fotos favoritas para concluir a compra"
    },
    {
      number: 4,
      icon: <Download size={32} />,
      title: "Baixe suas fotos",
      description: "Receba as fotos em alta qualidade"
    }
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;