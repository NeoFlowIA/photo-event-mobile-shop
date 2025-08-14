import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { formatCpf } from '@/lib/cpfValidation';

interface HirePhotographerModalProps {
  open: boolean;
  onClose: () => void;
  preselectedPhotographer?: string;
}

const HirePhotographerModal = ({ open, onClose, preselectedPhotographer }: HirePhotographerModalProps) => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    tipoEvento: '',
    dataEvento: '',
    orcamento: '',
    observacoes: '',
    fotografo: preselectedPhotographer || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nome || !form.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e e-mail.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🎉 Solicitação enviada!",
      description: "Um especialista entrará em contato em breve.",
    });
    
    onClose();
    setForm({
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      tipoEvento: '',
      dataEvento: '',
      orcamento: '',
      observacoes: '',
      fotografo: ''
    });
  };

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length >= 11) {
      formatted = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3');
    } else if (numbers.length >= 6) {
      formatted = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '+55 ($1) $2-$3');
    } else if (numbers.length >= 2) {
      formatted = numbers.replace(/(\d{2})(\d{0,5})/, '+55 ($1) $2');
    }
    
    setForm(prev => ({ ...prev, telefone: formatted }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar orçamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="telefone">Telefone/WhatsApp</Label>
            <Input
              id="telefone"
              value={form.telefone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+55 (11) 99999-9999"
              maxLength={20}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade/UF</Label>
              <Select value={form.cidade} onValueChange={(value) => setForm(prev => ({ ...prev, cidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fortaleza-ce">Fortaleza/CE</SelectItem>
                  <SelectItem value="recife-pe">Recife/PE</SelectItem>
                  <SelectItem value="brasilia-df">Brasília/DF</SelectItem>
                  <SelectItem value="salvador-ba">Salvador/BA</SelectItem>
                  <SelectItem value="sao-paulo-sp">São Paulo/SP</SelectItem>
                  <SelectItem value="rio-de-janeiro-rj">Rio de Janeiro/RJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo-evento">Tipo de evento</Label>
              <Select value={form.tipoEvento} onValueChange={(value) => setForm(prev => ({ ...prev, tipoEvento: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrida-de-rua">Corrida de rua</SelectItem>
                  <SelectItem value="triathlon">Triathlon</SelectItem>
                  <SelectItem value="ciclismo">Ciclismo</SelectItem>
                  <SelectItem value="show">Show</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data-evento">Data do evento</Label>
              <Input
                id="data-evento"
                type="date"
                value={form.dataEvento}
                onChange={(e) => setForm(prev => ({ ...prev, dataEvento: e.target.value }))}
                placeholder="dd/mm/aaaa"
              />
            </div>
            
            <div>
              <Label htmlFor="orcamento">Orçamento estimado</Label>
              <Select value={form.orcamento} onValueChange={(value) => setForm(prev => ({ ...prev, orcamento: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-1000">Até R$ 1.000</SelectItem>
                  <SelectItem value="1000-3000">R$ 1.000 - 3.000</SelectItem>
                  <SelectItem value="3000-6000">R$ 3.000 - 6.000</SelectItem>
                  <SelectItem value="acima-6000">R$ 6.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={form.observacoes}
              onChange={(e) => setForm(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Ex.: Corrida de 5k, 20/09/2025. Preciso de cobertura completa do evento..."
              rows={3}
            />
          </div>
          
          {preselectedPhotographer && (
            <input type="hidden" value={preselectedPhotographer} />
          )}
          
          <div className="flex gap-2 pt-4">
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
              className="flex-1 bg-[var(--brand-primary)] hover:bg-[#CC3434]"
            >
              Enviar solicitação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HirePhotographerModal;