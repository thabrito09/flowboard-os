import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementProps {
  show: boolean;
  onComplete: () => void;
  type?: 'mission' | 'phase' | 'level';
}

export default function Achievement({ show, onComplete, type = 'mission' }: AchievementProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!isVisible) return null;
  
  const messages = {
    mission: 'Missão Concluída!',
    phase: 'Fase Concluída!',
    level: 'Nível Alcançado!'
  };
  
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg",
      "animate-in slide-in-from-top-2 fade-in duration-300"
    )}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <p className="font-semibold">{messages[type]}</p>
      </div>
    </div>
  );
}