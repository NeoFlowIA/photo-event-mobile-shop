import { Badge } from '@/components/ui/badge';
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl shadow-sm p-6">
              <div className="mb-2">
                <span className="text-2xl lg:text-3xl font-bold text-[#E03A3A]">
                  {stat.value}
                </span>
                <span className="text-2xl lg:text-3xl font-bold text-secondary ml-1">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm text-secondary/70 max-w-[200px] mx-auto">
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