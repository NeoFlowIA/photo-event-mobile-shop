import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/http';
import { formatCpf, validateCpf } from '@/lib/cpfValidation';
import { digitsOnly, formatPhone, normalizeSocialLinks, normalizeUrl } from '@/lib/formatters';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    role: z.enum(['user', 'photographer']),
    displayName: z.string().min(1, 'Informe seu nome completo'),
    email: z.string().email('Informe um e-mail válido'),
    password: z.string().min(8, 'A senha deve conter ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    cpf: z.string().min(14, 'Informe um CPF válido'),
    acceptedTerms: z.boolean(),
    biography: z.string().max(500, 'Máximo de 500 caracteres').optional(),
    phoneNumber: z.string().optional(),
    websiteUrl: z.string().optional(),
    socialLinks: z.string().optional(),
    profileImageUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (!validateCpf(data.cpf)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF inválido',
        path: ['cpf'],
      });
    }

    if (!data.acceptedTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'É necessário aceitar os termos de uso',
        path: ['acceptedTerms'],
      });
    }

    if (data.phoneNumber) {
      const phoneDigits = digitsOnly(data.phoneNumber);
      if (phoneDigits.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe um telefone válido',
          path: ['phoneNumber'],
        });
      }
    }

    // Validar URLs
    (['websiteUrl', 'profileImageUrl', 'coverImageUrl'] as const).forEach((field) => {
      const value = data[field];
      if (value && value.trim() && !/^https?:\/\//i.test(value.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe uma URL válida (inclua http:// ou https://)',
          path: [field],
        });
      }
    });
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register: registerAccount, pendingAction, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      cpf: '',
      acceptedTerms: false,
      biography: '',
      phoneNumber: '',
      websiteUrl: '',
      socialLinks: '',
      profileImageUrl: '',
      coverImageUrl: '',
    },
  });

  const selectedRole = registerForm.watch('role');
  const totalSteps = selectedRole === 'photographer' ? 2 : 1;

  const isLoggingIn = pendingAction === 'login';
  const isRegistering = pendingAction === 'register';

  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setLoginError(null);
      setRegisterError(null);
    }
  }, [open]);

  const handleCpfChange = (value: string) => {
    registerForm.setValue('cpf', formatCpf(value), { shouldDirty: true, shouldValidate: false });
  };

  const handlePhoneChange = (value: string) => {
    registerForm.setValue('phoneNumber', formatPhone(value), { shouldDirty: true, shouldValidate: false });
  };

  const handleNextStep = async () => {
    const fieldsToValidate: Array<keyof RegisterFormValues> = [
      'role',
      'displayName',
      'email',
      'password',
      'confirmPassword',
      'cpf',
      'acceptedTerms',
    ];
    const isValid = await registerForm.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const resetForms = useCallback(() => {
    loginForm.reset();
    registerForm.reset();
    setCurrentStep(1);
    setLoginError(null);
    setRegisterError(null);
  }, [loginForm, registerForm]);

  const handleClose = useCallback(() => {
    resetForms();
    onClose();
  }, [onClose, resetForms]);

  useEffect(() => {
    if (open && isAuthenticated) {
      handleClose();
    }
  }, [handleClose, isAuthenticated, open]);

  const onSubmitLogin = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await login({ email: values.email.trim(), password: values.password });
      toast({ title: 'Login realizado!', description: 'Bem-vindo(a) de volta 🎉' });
      handleClose();
    } catch (error) {
      if (error instanceof ApiError) {
        const message = error.status === 401 ? 'E-mail ou senha inválidos.' : error.message;
        setLoginError(message);
      } else {
        setLoginError('Não foi possível entrar. Tente novamente.');
        console.error(error);
      }
    }
  };

  const buildRegisterPayload = (values: RegisterFormValues) => {
    const basePayload = {
      email: values.email.trim(),
      password: values.password,
      displayName: values.displayName.trim(),
      role: values.role,
      cpf: digitsOnly(values.cpf),
      acceptedTerms: values.acceptedTerms,
    } as const;

    if (values.role === 'photographer') {
      const cleanPhone = digitsOnly(values.phoneNumber || '');
      return {
        ...basePayload,
        photographerProfile: {
          biography: values.biography?.trim() || null,
          phoneNumber: cleanPhone ? cleanPhone : null,
          websiteUrl: normalizeUrl(values.websiteUrl) ?? null,
          socialLinks: normalizeSocialLinks(values.socialLinks) ?? null,
          profileImageUrl: normalizeUrl(values.profileImageUrl) ?? null,
          coverImageUrl: normalizeUrl(values.coverImageUrl) ?? null,
          cpf: digitsOnly(values.cpf),
          acceptedTerms: values.acceptedTerms,
        },
      };
    }

    return basePayload;
  };

  const onSubmitRegister = async (values: RegisterFormValues) => {
    setRegisterError(null);
    try {
      await registerAccount(buildRegisterPayload(values));
      const successMessage =
        values.role === 'photographer'
          ? 'Cadastro enviado! Vamos direcionar você para o painel do fotógrafo.'
          : 'Cadastro realizado com sucesso!';
      toast({ title: 'Cadastro concluído', description: successMessage });
      handleClose();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setRegisterError('Este e-mail já está cadastrado. Faça login ou utilize outro endereço.');
        } else if (error.status === 400) {
          setRegisterError(error.message || 'Verifique os dados informados e tente novamente.');
        } else {
          setRegisterError(error.message || 'Não foi possível concluir o cadastro. Tente novamente.');
        }
      } else {
        setRegisterError('Não foi possível concluir o cadastro. Tente novamente.');
        console.error(error);
      }
    }
  };

  const summaryData = {
    displayName: registerForm.watch('displayName'),
    email: registerForm.watch('email'),
    cpf: registerForm.watch('cpf'),
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar-se</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
              <div>
                <Label htmlFor="login-email">E-mail</Label>
                <Input id="login-email" type="email" autoComplete="email" {...loginForm.register('email')} />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            {registerError && (
              <Alert variant="destructive">
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    } ${step > totalSteps ? 'opacity-30' : ''}`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Etapa {Math.min(currentStep, totalSteps)} de {totalSteps}
              </span>
            </div>

            <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de conta</Label>
                    <RadioGroup
                      value={selectedRole}
                      onValueChange={(value) => {
                        registerForm.setValue('role', value as RegisterFormValues['role']);
                        setCurrentStep(1);
                      }}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="role-user" />
                        <Label htmlFor="role-user">Sou cliente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="photographer" id="role-photographer" />
                        <Label htmlFor="role-photographer">Sou fotógrafo(a)</Label>
                      </div>
                    </RadioGroup>
                    {registerForm.formState.errors.role && (
                      <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.role.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-name">Nome completo</Label>
                    <Input id="register-name" autoComplete="name" {...registerForm.register('displayName')} />
                    {registerForm.formState.errors.displayName && (
                      <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.displayName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-email">E-mail</Label>
                    <Input id="register-email" type="email" autoComplete="email" {...registerForm.register('email')} />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        {...registerForm.register('password')}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        {...registerForm.register('confirmPassword')}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-cpf">CPF</Label>
                    <Input
                      id="register-cpf"
                      maxLength={14}
                      {...registerForm.register('cpf')}
                      onChange={(event) => handleCpfChange(event.target.value)}
                      value={registerForm.watch('cpf')}
                      placeholder="000.000.000-00"
                    />
                    {registerForm.formState.errors.cpf && (
                      <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.cpf.message}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="register-terms"
                      checked={registerForm.watch('acceptedTerms')}
                      onCheckedChange={(checked) =>
                        registerForm.setValue('acceptedTerms', Boolean(checked), {
                          shouldValidate: true,
                        })
                      }
                    />
                    <Label htmlFor="register-terms" className="text-sm leading-snug">
                      Li e aceito os Termos de Uso e a Política de Privacidade
                    </Label>
                  </div>
                  {registerForm.formState.errors.acceptedTerms && (
                    <p className="text-sm text-destructive -mt-2">
                      {registerForm.formState.errors.acceptedTerms.message}
                    </p>
                  )}
                </div>
              )}

              {currentStep === 2 && selectedRole === 'photographer' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="register-bio">Biografia</Label>
                    <Textarea
                      id="register-bio"
                      rows={4}
                      placeholder="Conte um pouco sobre seu trabalho..."
                      {...registerForm.register('biography')}
                    />
                    {registerForm.formState.errors.biography && (
                      <p className="text-sm text-destructive mt-1">{registerForm.formState.errors.biography.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="register-phone">Telefone/WhatsApp</Label>
                      <Input
                        id="register-phone"
                        placeholder="(85) 99999-9999"
                        {...registerForm.register('phoneNumber')}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        value={registerForm.watch('phoneNumber')}
                      />
                      {registerForm.formState.errors.phoneNumber && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-website">Site ou portfólio</Label>
                      <Input id="register-website" placeholder="https://" {...registerForm.register('websiteUrl')} />
                      {registerForm.formState.errors.websiteUrl && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.websiteUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-social">Redes sociais</Label>
                    <Input
                      id="register-social"
                      placeholder="@instagram, behance.net/seuportfolio"
                      {...registerForm.register('socialLinks')}
                    />
                    {registerForm.formState.errors.socialLinks && (
                      <p className="text-sm text-destructive mt-1">
                        {registerForm.formState.errors.socialLinks.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="register-profile-image">URL da foto de perfil</Label>
                      <Input id="register-profile-image" placeholder="https://" {...registerForm.register('profileImageUrl')} />
                      {registerForm.formState.errors.profileImageUrl && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.profileImageUrl.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-cover-image">URL da foto de capa</Label>
                      <Input id="register-cover-image" placeholder="https://" {...registerForm.register('coverImageUrl')} />
                      {registerForm.formState.errors.coverImageUrl && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.coverImageUrl.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border p-4 bg-muted/40">
                    <h4 className="text-sm font-semibold mb-2">Resumo do cadastro</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>
                        <span className="font-medium text-foreground">Nome:</span> {summaryData.displayName}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">E-mail:</span> {summaryData.email}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">CPF:</span> {summaryData.cpf}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}

                {selectedRole === 'photographer' && currentStep === 1 && (
                  <Button type="button" onClick={handleNextStep} className="flex-1">
                    Avançar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {((selectedRole === 'user' && currentStep === 1) ||
                  (selectedRole === 'photographer' && currentStep === 2)) && (
                  <Button type="submit" className="flex-1" disabled={isRegistering}>
                    {isRegistering ? 'Enviando...' : 'Concluir cadastro'}
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
