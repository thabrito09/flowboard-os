import { Brain, Palette, BookOpen, Dumbbell, Sparkles, Briefcase, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface LifeAreaCardsProps {
  userId: string;
}

export default function LifeAreaCards({ userId }: LifeAreaCardsProps) {
  const navigate = useNavigate();
  const { userData } = useUser();
  
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  const lifeAreas = [
    {
      id: 'mind',
      name: 'Mente',
      icon: <Brain className="h-5 w-5" />,
      color: 'hover:bg-blue-500/10',
    },
    {
      id: 'creation',
      name: 'Criação',
      icon: <Palette className="h-5 w-5" />,
      color: 'hover:bg-purple-500/10',
    },
    {
      id: 'learning',
      name: 'Aprendizado',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'hover:bg-amber-500/10',
    },
    {
      id: 'body',
      name: 'Corpo & Energia',
      icon: <Dumbbell className="h-5 w-5" />,
      color: 'hover:bg-green-500/10',
    },
    {
      id: 'faith',
      name: 'Fé & Propósito',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'hover:bg-indigo-500/10',
    },
    {
      id: 'work',
      name: 'Trabalho',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'hover:bg-orange-500/10',
    },
    {
      id: 'finances',
      name: 'Finanças',
      icon: <PiggyBank className="h-5 w-5" />,
      color: 'hover:bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {lifeAreas.map((area) => (
        <Button
          key={area.id}
          variant="ghost"
          className={cn(
            "h-auto flex flex-col items-center justify-center p-6 rounded-xl",
            "hover:scale-105 transition-all duration-200",
            "bg-gradient-to-br from-background to-muted/50 shadow-lg border-none",
            area.color
          )}
          onClick={() => navigate(`/areas/${userId}?section=${area.id}`)}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-3",
            "bg-gradient-to-br shadow-inner",
            getGradient()
          )}>
            {area.icon}
          </div>
          <span className="font-medium text-sm">{area.name}</span>
        </Button>
      ))}
    </div>
  );
}