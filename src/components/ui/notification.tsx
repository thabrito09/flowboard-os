import { useEffect } from 'react';
import { Sparkles, Star, Trophy, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface NotificationProps {
  title: string;
  description?: string;
  type?: 'achievement' | 'level' | 'mission' | 'default';
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  title, 
  description, 
  type = 'default',
  duration = 5000,
  onClose 
}: NotificationProps) {
  const { userData } = useUser();
  
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-5 w-5" />;
      case 'level':
        return <Star className="h-5 w-5" />;
      case 'mission':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <div className={cn(
      "fixed bottom-4 right-4 max-w-sm w-full bg-card shadow-lg rounded-lg border p-4",
      "animate-in slide-in-from-right-full duration-300",
      "hover:shadow-xl transition-shadow"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "shrink-0 p-2 rounded-full",
          "bg-gradient-to-r text-white",
          getGradient()
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1 space-y-1">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <span className="sr-only">Fechar</span>
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}