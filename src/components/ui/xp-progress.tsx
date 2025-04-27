import { useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface XPProgressProps {
  value: number;
  previousValue: number;
  className?: string;
}

export default function XPProgress({ value, previousValue, className }: XPProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const { userData } = useUser();
  
  useEffect(() => {
    if (value > previousValue && progressRef.current) {
      progressRef.current.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  }, [value, previousValue]);
  
  // Get level-based gradient
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <Progress 
      value={value} 
      ref={progressRef}
      className={cn(
        "h-2 bg-muted/30",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        getGradient(),
        className
      )}
    />
  );
}