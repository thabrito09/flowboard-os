import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelInfoProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  children?: React.ReactNode;
}

export default function LevelInfo({ level, xp, xpToNextLevel, children }: LevelInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const progress = (xp / xpToNextLevel) * 100;
  
  const getGradient = () => {
    if (level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  const getMotivationalMessage = () => {
    if (progress < 30) return 'Continue assim! Cada pequena ação conta.';
    if (progress < 60) return 'Você está no caminho certo! Mantenha o foco.';
    if (progress < 90) return 'Incrível progresso! O próximo nível está próximo.';
    return 'Você está quase lá! Continue brilhando!';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className={cn(
              "h-5 w-5 bg-gradient-to-r bg-clip-text text-transparent",
              getGradient()
            )} />
            Nível {level}
          </DialogTitle>
          <DialogDescription>
            Sua jornada de evolução pessoal
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">XP Atual: {xp}</span>
              <span className="text-muted-foreground">Próximo Nível: {xpToNextLevel}</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2 bg-muted/30",
                "before:absolute before:inset-0 before:bg-gradient-to-r",
                getGradient()
              )}
            />
          </div>
          
          {/* Level Benefits */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Benefícios do Nível {level}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Acesso a novas funcionalidades e recursos</p>
              <p>• Temas visuais exclusivos</p>
              <p>• Maior capacidade de personalização</p>
            </div>
          </div>
          
          {/* Motivational Message */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm italic text-center">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}