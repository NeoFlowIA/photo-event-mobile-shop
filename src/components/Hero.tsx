import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import CpfModal from './CpfModal';
import HirePhotographerModal from './HirePhotographerModal';

const Hero = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'selfie' | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processSelfieSearch();
    }
  };

  const handleCameraClick = () => {
    if (!user?.cpf) {
      setPendingAction('selfie');
      setShowCpfModal(true);
      return;
    }
    document.getElementById('selfie-upload')?.click();
  };

  const processSelfieSearch = () => {
    setSearchMessage('📸 Foto enviada! Estamos procurando suas fotos... (mock)');
    setTimeout(() => setSearchMessage(''), 3000);
  };

  const handleCpfConfirm = () => {
    if (pendingAction === 'selfie') {
      document.getElementById('selfie-upload')?.click();
    }
    setPendingAction(null);
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Decorative images - desktop only */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-20 h-24 rounded-xl rotate-12 opacity-80 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150&h=180&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-24 h-20 rounded-xl -rotate-6 opacity-70 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=180&h=150&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-18 h-22 rounded-xl rotate-3 opacity-75 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=135&h=165&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
      
      <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-32 space-y-4">
        <div className="w-24 h-28 rounded-xl -rotate-12 opacity-80 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=180&h=210&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-20 h-24 rounded-xl rotate-6 opacity-70 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=150&h=180&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-26 h-20 rounded-xl -rotate-3 opacity-75 shadow-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=195&h=150&fit=crop&crop=faces" 
            alt="Decorative event photo" 
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            <span className="text-[var(--brand-secondary)]">Capture a emoção,</span>
            <br />
            <span className="text-[var(--brand-accent)]">reviva suas memórias</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--brand-muted)] max-w-2xl mx-auto mb-6">
            Encontre, escolha e eternize cada lembrança.
          </p>

          <div className="mb-8">
            <Button 
              onClick={() => setShowHireModal(true)}
              variant="outline"
              size="lg"
              className="text-[var(--brand-primary)] hover:text-[#CC3434] border-[var(--brand-stroke)] hover:bg-[var(--brand-primary)]/5"
            >
              Quero contratar um fotógrafo
            </Button>
          </div>

          {/* Selfie Match Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-[var(--brand-surface)] rounded-xl shadow-md px-4 py-3 flex flex-col sm:flex-row items-center gap-3 text-[var(--brand-text)]">
              <div className="flex items-center gap-3 w-full sm:flex-1">
                <button 
                  onClick={handleCameraClick}
                  className="flex-shrink-0 text-[#6B7280] hover:text-[var(--brand-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary)]"
                  aria-label="Enviar selfie"
                >
                  <Camera size={22} />
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
                className="bg-[var(--brand-primary)] hover:bg-[#CC3434] text-white rounded-lg px-4 py-2 w-full sm:w-auto whitespace-nowrap focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                Enviar foto
              </Button>
            </div>
            {searchMessage && (
              <div className="mt-3 p-2 text-sm text-green-600 font-medium bg-green-50 rounded-lg">
                {searchMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CpfModal
        open={showCpfModal}
        onClose={() => setShowCpfModal(false)}
        onConfirm={handleCpfConfirm}
      />
      
      <HirePhotographerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
      />
    </section>
  );
};

export default Hero;