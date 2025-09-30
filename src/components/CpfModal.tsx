import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { formatCpf, validateCpf } from '@/lib/cpfValidation';
import { useAuth } from '@/contexts/AuthContext';

interface CpfModalProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
}

const CpfModal = ({ open, onClose, onOpenChange, onConfirm }: CpfModalProps) => {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
    onOpenChange?.(newOpen);
  };
  const { setCpf } = useAuth();
  const [cpf, setCpfValue] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCpf(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique o CPF informado.",
        variant: "destructive"
      });
      return;
    }

    if (saveForFuture) {
      setCpf(cpf);
    }
    
    toast({
      title: "CPF confirmado",
      description: "Agora você pode prosseguir com a busca.",
    });
    
    onConfirm();
    onClose();
    setCpfValue('');
    setSaveForFuture(false);
  };

  const handleCpfChange = (value: string) => {
    setCpfValue(formatCpf(value));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Identificação rápida</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[var(--brand-muted)]">
            Para buscar suas fotos, precisamos confirmar sua identidade com seu CPF.
          </p>
          
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => handleCpfChange(e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              required
              aria-describedby="cpf-help"
            />
            <p id="cpf-help" className="text-xs text-[var(--brand-muted)] mt-1">
              Seus dados são protegidos e usados apenas para identificação.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-cpf"
              checked={saveForFuture}
              onCheckedChange={(checked) => setSaveForFuture(!!checked)}
            />
            <Label htmlFor="save-cpf" className="text-sm">
              Salvar CPF para as próximas buscas
            </Label>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!validateCpf(cpf)}
              className="flex-1 bg-[var(--brand-primary)] hover:bg-[#CC3434]"
            >
              Confirmar CPF
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CpfModal;
