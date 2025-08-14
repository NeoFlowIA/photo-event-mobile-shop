const Hero = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Decorative images - desktop only */}
      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-20 h-24 bg-muted rounded-xl rotate-12 opacity-80"></div>
        <div className="w-24 h-20 bg-muted rounded-xl -rotate-6 opacity-60"></div>
        <div className="w-16 h-20 bg-muted rounded-xl rotate-3 opacity-70"></div>
      </div>
      
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-24 h-32 bg-muted rounded-xl -rotate-12 opacity-80"></div>
        <div className="w-20 h-24 bg-muted rounded-xl rotate-6 opacity-60"></div>
        <div className="w-28 h-20 bg-muted rounded-xl -rotate-3 opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-foreground">Capture a emoção,</span>
            <br />
            <span className="text-accent">reviva suas memórias</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre, escolha e eternize cada lembrança.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;