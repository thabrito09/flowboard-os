import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { Sun, Bell, User, Book, HelpCircle } from 'lucide-react';
import ProfileSection from './ProfileSection';
import PreferencesSection from './PreferencesSection';
import NotificationsSection from './NotificationsSection';
import ManualSection from './ManualSection';
import SupportSection from './SupportSection';

export default function SettingsPage() {
  const { userData } = useUser();
  
  if (!userData) return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e personalize sua experiência
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Preferências</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>Manual</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Suporte</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSection />
        </TabsContent>
        
        <TabsContent value="manual">
          <ManualSection />
        </TabsContent>

        <TabsContent value="support">
          <SupportSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}