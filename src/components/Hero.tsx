import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchMessage, setSearchMessage] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSearchMessage('📸 Foto enviada! Estamos procurando suas fotos...');
      setTimeout(() => setSearchMessage(''), 3000);
    }
  };

  const handleCameraClick = () => {
    document.getElementById('selfie-upload')?.click();
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Decorative images - desktop only */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 w-24 space-y-3">
        <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-xl rotate-12 opacity-80 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-xl"></div>
        </div>
        <div className="w-20 h-16 bg-gradient-to-br from-accent/20 to-primary/30 rounded-xl -rotate-6 opacity-70 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 rounded-xl"></div>
        </div>
        <div className="w-14 h-18 bg-gradient-to-br from-primary/30 to-accent/20 rounded-xl rotate-3 opacity-75 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-150 to-red-250 rounded-xl"></div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-24 space-y-3">
        <div className="w-20 h-24 bg-gradient-to-br from-accent/30 to-primary/20 rounded-xl -rotate-12 opacity-80 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 rounded-xl"></div>
        </div>
        <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-xl rotate-6 opacity-70 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-xl"></div>
        </div>
        <div className="w-22 h-16 bg-gradient-to-br from-accent/20 to-primary/30 rounded-xl -rotate-3 opacity-75 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-red-250 to-red-200 rounded-xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            <span className="text-secondary">Capture a emoção,</span>
            <br />
            <span style={{ color: '#FF6B6B' }}>reviva suas memórias</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Encontre, escolha e eternize cada lembrança.
          </p>

          {/* Selfie Match Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-md px-4 py-3 flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-3 w-full md:flex-1">
                <button 
                  onClick={handleCameraClick}
                  className="flex-shrink-0 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Enviar foto"
                >
                  <Camera size={24} />
                </button>
                <Input
                  placeholder="Envie uma selfie para encontrar suas fotos"
                  className="border-0 bg-transparent flex-1 text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  readOnly
                  onClick={handleCameraClick}
                />
                <input
                  id="selfie-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <Button 
                onClick={handleCameraClick}
                className="bg-[#E03A3A] hover:bg-red-600 text-white rounded-lg px-4 py-2 whitespace-nowrap"
              >
                Enviar foto
              </Button>
            </div>
            {searchMessage && (
              <div className="mt-3 text-sm text-green-600 font-medium">
                {searchMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;