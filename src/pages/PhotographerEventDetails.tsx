import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Upload, DollarSign, UserPlus, BarChart3, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const PhotographerEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock event data
  const [event] = useState({
    id: id || '1',
    nome: 'Corrida de 5k Centro Histórico',
    descricao: 'Uma corrida de rua de 5 quilômetros pelo centro histórico da cidade, passando pelos principais pontos turísticos.',
    data: '2024-03-15',
    local: 'Centro Histórico, Fortaleza - CE',
    categoria: 'Corrida de rua',
    precoBase: 15.00,
    participantes: 250,
    fotos: 340,
    status: 'ativo'
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [precos, setPrecos] = useState([
    { id: 1, numero: '001', preco: 15.00 },
    { id: 2, numero: '002', preco: 15.00 },
    { id: 3, numero: '003', preco: 25.00 }
  ]);
  const [colaboradores, setColaboradores] = useState([
    { id: 1, email: 'assistente@email.com', nome: 'Maria Silva', percentual: 30 }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedImages(prev => [...prev, ...files]);
    
    toast({
      title: "Imagens carregadas!",
      description: `${files.length} imagem(ns) adicionada(s) com sucesso.`,
    });
  };

  const handleBulkPriceChange = (novoPreco: string) => {
    const preco = parseFloat(novoPreco);
    if (!isNaN(preco)) {
      setPrecos(prev => prev.map(item => ({ ...item, preco })));
      toast({
        title: "Preços atualizados!",
        description: "Todos os preços foram alterados para o valor informado.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={event.nome} showCart={false} showBack={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.nome}</h1>
              <p className="text-muted-foreground">{event.descricao}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Em andamento</Badge>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-muted-foreground" />
              <span>{new Date(event.data).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <span>{event.local}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-muted-foreground" />
              <span>{event.participantes} participantes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={16} className="text-muted-foreground" />
              <span>R$ {event.precoBase.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="precos">Preços</TabsTrigger>
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do evento</Label>
                    <Input value={event.nome} readOnly />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input value={event.categoria} readOnly />
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Input value={event.data} readOnly />
                  </div>
                  <div>
                    <Label>Local</Label>
                    <Input value={event.local} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Input value={event.descricao} readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={20} />
                  Upload em Lote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulk-upload">Selecionar imagens</Label>
                  <Input
                    id="bulk-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecione múltiplas imagens para upload em lote.
                  </p>
                </div>
                
                {uploadedImages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Imagens carregadas ({uploadedImages.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedImages.slice(0, 8).map((file, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{file.name.substring(0, 10)}...</span>
                        </div>
                      ))}
                    </div>
                    {uploadedImages.length > 8 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        +{uploadedImages.length - 8} imagens adicionais
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="precos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Definir Preços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Novo preço para todos"
                    type="number"
                    step="0.01"
                    onChange={(e) => e.target.value && handleBulkPriceChange(e.target.value)}
                  />
                  <Button variant="outline">Aplicar a todos</Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Preços individuais</h4>
                  {precos.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className="w-16 text-sm">#{item.numero}</span>
                      <Input 
                        type="number" 
                        step="0.01"
                        value={item.preco} 
                        onChange={(e) => {
                          const novoPreco = parseFloat(e.target.value);
                          setPrecos(prev => prev.map(p => 
                            p.id === item.id ? { ...p, preco: novoPreco } : p
                          ));
                        }}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">R$</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="colaboradores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus size={20} />
                  Colaboradores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="E-mail do colaborador" />
                  <Input placeholder="%" type="number" className="w-20" />
                  <Button>Adicionar</Button>
                </div>
                
                <div className="space-y-2">
                  {colaboradores.map((colaborador) => (
                    <div key={colaborador.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{colaborador.nome}</p>
                        <p className="text-sm text-muted-foreground">{colaborador.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{colaborador.percentual}%</span>
                        <Button variant="outline" size="sm">Remover</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="estatisticas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <BarChart3 size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Em breve</h3>
                  <p className="text-muted-foreground">
                    Estatísticas detalhadas sobre vendas, downloads e performance do evento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PhotographerEventDetails;