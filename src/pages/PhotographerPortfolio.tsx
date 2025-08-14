import { useState } from 'react';
import { Camera, Edit, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSessionMock } from '@/hooks/useSessionMock';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const PhotographerPortfolio = () => {
  const { session, updateSession } = useSessionMock();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: session.perfil?.bio || '',
    telefone: session.perfil?.telefone || '',
    website: session.perfil?.website || '',
    redes: session.perfil?.redes || ''
  });

  const mockPortfolioImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=400&fit=crop'
  ];

  const handleSaveProfile = () => {
    updateSession({
      perfil: {
        ...session.perfil,
        ...editForm
      }
    });
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Meu Portfólio" showCart={false} showBack={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="relative h-64 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
          {session.perfil?.urlCapa ? (
            <img 
              src={session.perfil.urlCapa} 
              alt="Capa do perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={48} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {session.perfil?.urlPerfil ? (
                <img 
                  src={session.perfil.urlPerfil} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={32} className="text-muted-foreground" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{session.nome}</h1>
                <p className="text-xl text-muted-foreground mb-2">{session.perfil?.handle}</p>
                <p className="text-muted-foreground mb-4">{session.perfil?.bio}</p>
                
                <div className="flex flex-col gap-2">
                  {session.perfil?.telefone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={16} />
                      <span>{session.perfil.telefone}</span>
                    </div>
                  )}
                  
                  {session.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={16} />
                      <span>{session.email}</span>
                    </div>
                  )}
                  
                  {session.perfil?.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink size={16} />
                      <a href={session.perfil.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        {session.perfil.website}
                      </a>
                    </div>
                  )}
                  
                  {session.perfil?.redes && (
                    <p className="text-sm text-muted-foreground">{session.perfil.redes}</p>
                  )}
                </div>
              </div>
              
              <Button onClick={() => setEditModalOpen(true)} className="flex items-center gap-2">
                <Edit size={16} />
                Editar perfil
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Trabalhos Anteriores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPortfolioImages.map((image, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src={image} 
                    alt={`Trabalho ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-bio">Biografia</Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Conte um pouco sobre seu trabalho..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-telefone">Telefone/WhatsApp</Label>
              <Input
                id="edit-telefone"
                value={editForm.telefone}
                onChange={(e) => setEditForm(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(85) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={editForm.website}
                onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://seuportfolio.com"
              />
            </div>

            <div>
              <Label htmlFor="edit-redes">Redes sociais</Label>
              <Input
                id="edit-redes"
                value={editForm.redes}
                onChange={(e) => setEditForm(prev => ({ ...prev, redes: e.target.value }))}
                placeholder="@seuinstagram, behance.net/seuportfolio"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} className="flex-1">
                Salvar alterações
              </Button>
              <Button variant="outline" onClick={() => setEditModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotographerPortfolio;