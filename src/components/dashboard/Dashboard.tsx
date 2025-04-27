import { useParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import DailyMissions from './DailyMissions';
import LifeAreaCards from './LifeAreaCards';
import DailyQuote from './DailyQuote';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Coins, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useUser();
  
  if (!userId || !userData?.id || userId !== userData.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Usuário inválido. Por favor, recarregue ou entre novamente.</p>
      </div>
    );
  }
  
  // Get level-based colors
  const getLevelColors = () => {
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };

  const xpProgress = (userData.xp / userData.xpToNextLevel) * 100;
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {userData.name}!
          </h1>
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1.5 text-base font-medium bg-gradient-to-r bg-clip-text text-transparent animate-in fade-in-50 duration-500",
              getLevelColors()
            )}
          >
            <Star className="h-4 w-4 mr-1.5 inline-block" />
            Nível {userData.level}
          </Badge>
        </div>
        
        {/* XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">XP: {userData.xp}</span>
            <span className="text-muted-foreground">Próximo nível: {userData.xpToNextLevel}</span>
          </div>
          <Progress 
            value={xpProgress} 
            className={cn(
              "h-2 bg-muted/30",
              "before:absolute before:inset-0 before:bg-gradient-to-r",
              getLevelColors()
            )}
          />
        </div>
      </div>
      
      {/* Daily Quote */}
      <DailyQuote />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Missions Section */}
        <Card className="md:row-span-2 border-none bg-gradient-to-br from-background to-muted/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Missões do Dia</CardTitle>
            <CardDescription>Complete para ganhar XP</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyMissions />
          </CardContent>
        </Card>
        
        {/* Weekly Progress */}
        <Card className="border-none bg-gradient-to-br from-background to-muted/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Progresso Semanal
              </CardTitle>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none"
              >
                {userData.weeklyProgress}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={userData.weeklyProgress} 
              className="h-2 bg-muted/30 before:absolute before:inset-0 before:bg-gradient-to-r from-green-500 to-emerald-500" 
            />
            <p className="text-sm text-muted-foreground mt-2">
              {userData.weeklyProgress < 50 
                ? 'Continue firme! Você está avançando.' 
                : 'Excelente progresso! Continue assim.'}
            </p>
          </CardContent>
        </Card>
        
        {/* Financial Progress */}
        <Card className="border-none bg-gradient-to-br from-background to-muted/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-primary" />
                Meta R$1M
              </CardTitle>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none"
              >
                {userData.financialProgress}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={userData.financialProgress} 
              className="h-2 bg-muted/30 before:absolute before:inset-0 before:bg-gradient-to-r from-blue-500 to-cyan-500" 
            />
            <p className="text-sm text-muted-foreground mt-2">
              A jornada financeira é uma maratona, não uma corrida.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Life Areas Quick Access */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Áreas da Vida</h2>
        <LifeAreaCards userId={userId} />
      </div>
    </div>
  );
}