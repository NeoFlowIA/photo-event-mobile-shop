import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatCpf, validateCpf } from '@/lib/cpfValidation';
import { useSessionMock } from '@/hooks/useSessionMock';

type Role = 'cliente' | 'fotografo';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { loginWith, login, DEMO_USERS } = useSessionMock();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    password: '',
    acceptTerms: false,
    tipo: 'cliente' as 'cliente' | 'fotografo',
    bio: '',
    telefone: '',
    website: '',
    redes: '',
    fotoPerfil: null as File | null,
    fotoCapa: null as File | null
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Check for deep link params to auto-fill login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginParam = urlParams.get('login');
    
    if (loginParam === 'cliente') {
      const clienteUser = DEMO_USERS.find(u => u.role === 'cliente');
      if (clienteUser) {
        setLoginForm({ email: clienteUser.email, password: clienteUser.senha });
      }
    } else if (loginParam === 'fotografo') {
      const fotografoUser = DEMO_USERS.find(u => u.role === 'fotografo');
      if (fotografoUser) {
        setLoginForm({ email: fotografoUser.email, password: fotografoUser.senha });
      }
    }
  }, [open, DEMO_USERS]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    const success = loginWith(loginForm.email, loginForm.password);
    
    if (!success) {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
      return;
    }
    
    const user = DEMO_USERS.find(u => u.email === loginForm.email);
    toast({
      title: "Login realizado!",
      description: `Bem-vindo(a), ${user?.nome}!`,
    });
    onClose();
  };

  const fillDemoCredentials = (role: 'cliente' | 'fotografo') => {
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setLoginForm({ email: user.email, password: user.senha });
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!registerForm.nome || !registerForm.email || !registerForm.password || !registerForm.tipo) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (registerForm.tipo === 'cliente') {
          if (!registerForm.cpf || !validateCpf(registerForm.cpf)) {
            toast({
              title: "CPF inválido",
              description: "Por favor, verifique o CPF informado.",
              variant: "destructive"
            });
            return false;
          }
          if (!registerForm.acceptTerms) {
            toast({
              title: "Termos de uso",
              description: "É necessário aceitar os termos de uso.",
              variant: "destructive"
            });
            return false;
          }
        }
        return true;
      case 3:
        if (registerForm.tipo === 'fotografo') {
          if (!registerForm.cpf || !validateCpf(registerForm.cpf)) {
            toast({
              title: "CPF inválido",
              description: "Por favor, verifique o CPF informado.",
              variant: "destructive"
            });
            return false;
          }
          if (!registerForm.acceptTerms) {
            toast({
              title: "Termos de uso",
              description: "É necessário aceitar os termos de uso.",
              variant: "destructive"
            });
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    const perfil = registerForm.tipo === 'fotografo' ? {
      bio: registerForm.bio,
      telefone: registerForm.telefone,
      website: registerForm.website,
      redes: registerForm.redes,
      urlPerfil: registerForm.fotoPerfil ? URL.createObjectURL(registerForm.fotoPerfil) : undefined,
      urlCapa: registerForm.fotoCapa ? URL.createObjectURL(registerForm.fotoCapa) : undefined,
      handle: `@${registerForm.nome.toLowerCase().replace(/\s+/g, '')}`
    } : undefined;

    login(registerForm.nome, registerForm.email, registerForm.tipo as Role, registerForm.cpf, perfil);
    
    const message = registerForm.tipo === 'fotografo' 
      ? "Bem-vindo! Seu perfil de fotógrafo foi criado (mock)"
      : "Sua conta foi criada com sucesso.";
      
    toast({
      title: "Cadastro realizado!",
      description: message,
    });
    setCurrentStep(1);
    onClose();
  };

  const handleCpfChange = (value: string) => {
    setRegisterForm(prev => ({
      ...prev,
      cpf: formatCpf(value)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar-se</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            {/* Demo user chips */}
            <div className="flex gap-2 mb-4">
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => fillDemoCredentials('cliente')}
              >
                Cliente demo
              </Badge>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => fillDemoCredentials('fotografo')}
              >
                Fotógrafo demo
              </Badge>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="mb-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? 'bg-primary text-primary-foreground'
                          : step <= currentStep + 1 && registerForm.tipo === 'fotografo'
                          ? 'bg-muted text-muted-foreground'
                          : step === 2 && registerForm.tipo === 'cliente'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {registerForm.tipo === 'cliente' ? 
                    `Etapa ${currentStep} de 2` : 
                    `Etapa ${currentStep} de 3`
                  }
                </span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <div>
                    <Label>Tipo de conta</Label>
                    <RadioGroup
                      value={registerForm.tipo}
                      onValueChange={(value) => setRegisterForm(prev => ({ ...prev, tipo: value as 'cliente' | 'fotografo' }))}
                      className="flex flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cliente" id="cliente" />
                        <Label htmlFor="cliente">Cliente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fotografo" id="fotografo" />
                        <Label htmlFor="fotografo">Fotógrafo</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="register-name">Nome completo</Label>
                    <Input
                      id="register-name"
                      value={registerForm.nome}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">E-mail</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && registerForm.tipo === 'fotografo' && (
                <>
                  <div>
                    <Label htmlFor="register-bio">Biografia</Label>
                    <Textarea
                      id="register-bio"
                      value={registerForm.bio}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte um pouco sobre seu trabalho..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-telefone">Telefone/WhatsApp</Label>
                    <Input
                      id="register-telefone"
                      value={registerForm.telefone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(85) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-website">Website</Label>
                    <Input
                      id="register-website"
                      value={registerForm.website}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://seuportfolio.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-redes">Redes sociais (Instagram, Behance, etc.)</Label>
                    <Input
                      id="register-redes"
                      value={registerForm.redes}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, redes: e.target.value }))}
                      placeholder="@seuinstagram, behance.net/seuportfolio"
                    />
                  </div>
                </>
              )}

              {((currentStep === 2 && registerForm.tipo === 'cliente') || 
                (currentStep === 3 && registerForm.tipo === 'fotografo')) && (
                <>
                  {registerForm.tipo === 'fotografo' && (
                    <>
                      <div>
                        <Label htmlFor="register-foto-perfil">Foto de Perfil</Label>
                        <Input
                          id="register-foto-perfil"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, fotoPerfil: e.target.files?.[0] || null }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-foto-capa">Foto de Capa</Label>
                        <Input
                          id="register-foto-capa"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, fotoCapa: e.target.files?.[0] || null }))}
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="register-cpf">CPF</Label>
                    <Input
                      id="register-cpf"
                      value={registerForm.cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerForm.acceptTerms}
                      onCheckedChange={(checked) => 
                        setRegisterForm(prev => ({ ...prev, acceptTerms: !!checked }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Aceito os termos de uso e política de privacidade
                    </Label>
                  </div>
                </>
              )}
              
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                )}
                
                {((currentStep === 1) || 
                  (currentStep === 2 && registerForm.tipo === 'fotografo')) && (
                  <Button type="button" onClick={handleNext} className="flex-1">
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                
                {((currentStep === 2 && registerForm.tipo === 'cliente') || 
                  (currentStep === 3 && registerForm.tipo === 'fotografo')) && (
                  <Button type="submit" className="flex-1">
                    Cadastrar-se
                  </Button>
                )}
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;