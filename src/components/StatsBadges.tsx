import statsData from '@/data/stats.json';

const StatsBadges = () => {
  const stats = [
    {
      value: `+${statsData.events}`,
      label: "Eventos",
      subtitle: "Registrados e eternizados"
    },
    {
      value: `+${statsData.photographers}`,
      label: "Fotógrafos", 
      subtitle: "Especializados em capturar emoções"
    },
    {
      value: `+${statsData.memories.toLocaleString()}`,
      label: "Memórias",
      subtitle: "Preservadas pelas nossas lentes"
    }
  ];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl shadow-sm p-6 min-w-[280px]">
              <div className="mb-2">
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-2xl lg:text-3xl font-bold text-secondary ml-2">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBadges;