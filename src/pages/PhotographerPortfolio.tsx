import { useEffect, useState } from 'react';
import { Camera, Edit, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const PhotographerPortfolio = () => {
  const { user, updateUser } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: user?.photographerProfile?.biography || '',
    telefone: user?.photographerProfile?.phoneNumber || '',
    website: user?.photographerProfile?.websiteUrl || '',
    redes: user?.photographerProfile?.socialLinks || ''
  });

  useEffect(() => {
    setEditForm({
      bio: user?.photographerProfile?.biography || '',
      telefone: user?.photographerProfile?.phoneNumber || '',
      website: user?.photographerProfile?.websiteUrl || '',
      redes: user?.photographerProfile?.socialLinks || ''
    });
  }, [user?.photographerProfile]);

  const mockPortfolioImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=400&fit=crop'
  ];

  const handleSaveProfile = () => {
    updateUser({
      photographerProfile: {
        ...user?.photographerProfile,
        biography: editForm.bio,
        phoneNumber: editForm.telefone,
        websiteUrl: editForm.website,
        socialLinks: editForm.redes,
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
          {user?.photographerProfile?.coverImageUrl ? (
            <img
              src={user.photographerProfile.coverImageUrl}
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
              {user?.photographerProfile?.profileImageUrl ? (
                <img
                  src={user.photographerProfile.profileImageUrl}
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
                <h1 className="text-3xl font-bold">{user?.displayName}</h1>
                <p className="text-xl text-muted-foreground mb-2">@{user?.displayName?.toLowerCase().replace(/\s+/g, '.')}</p>
                <p className="text-muted-foreground mb-4">{user?.photographerProfile?.biography}</p>

                <div className="flex flex-col gap-2">
                  {user?.photographerProfile?.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={16} />
                      <span>{user.photographerProfile.phoneNumber}</span>
                    </div>
                  )}

                  {user?.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  )}

                  {user?.photographerProfile?.websiteUrl && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink size={16} />
                      <a
                        href={user.photographerProfile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {user.photographerProfile.websiteUrl}
                      </a>
                    </div>
                  )}

                  {user?.photographerProfile?.socialLinks && (
                    <p className="text-sm text-muted-foreground">{user.photographerProfile.socialLinks}</p>
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