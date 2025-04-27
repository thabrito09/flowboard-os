import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Coins } from 'lucide-react';
import { useUserRoutes } from '@/lib/queries/routes';
import PersonalRoute from './PersonalRoute';
import FinancialRoute from './FinancialRoute';

export default function MyJourney() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('personal');
  const { data: routes = [], isLoading } = useUserRoutes(userId || '');
  
  // Early return if userId doesn't match current user
  if (!userId || !userData?.id || userId !== userData.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Acesso não autorizado.</p>
      </div>
    );
  }
  
  const personalRoute = routes.find(route => !route.goal.toLowerCase().includes('financeiro'));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Jornada</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e evolução pessoal
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span>Rota Personalizada</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1.5">
            <Coins className="h-4 w-4" />
            <span>Rota R$1M</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : (
            <PersonalRoute userId={userId} route={personalRoute} />
          )}
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialRoute userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
