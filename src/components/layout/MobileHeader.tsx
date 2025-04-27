import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Progress } from '@/components/ui/progress';
import LevelInfo from '@/components/ui/level-info';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function MobileHeader({ 
  isSidebarOpen, 
  setIsSidebarOpen
}: MobileHeaderProps) {
  const { userData } = useUser();
  const location = useLocation();
  
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/mentor')) return 'Mentor Interno';
    if (path.includes('/areas')) return 'Áreas da Vida';
    if (path.includes('/space')) return 'Meu Espaço';
    if (path.includes('/journey')) return 'Minha Jornada';
    if (path.includes('/settings')) return 'Configurações';
    return 'Dashboard';
  };

  const xpProgress = userData ? (userData.xp / userData.xpToNextLevel) * 100 : 0;
  
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border p-4 flex flex-col gap-2 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="shrink-0"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="font-semibold truncate">{getSectionTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {userData && (
            <LevelInfo
              level={userData.level}
              xp={userData.xp}
              xpToNextLevel={userData.xpToNextLevel}
            >
              <div className="text-right text-sm cursor-pointer hover:opacity-80 transition-opacity">
                <p className="text-muted-foreground">Nível {userData.level}</p>
                <p className="font-medium">{userData.xp}/{userData.xpToNextLevel} XP</p>
              </div>
            </LevelInfo>
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-white font-bold text-sm">
              {userData?.name?.[0]}
            </span>
          </div>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <Progress 
        value={xpProgress} 
        className={cn(
          "h-1 bg-muted/30",
          "before:absolute before:inset-0 before:bg-gradient-to-r",
          getGradient()
        )}
      />
    </header>
  );
}