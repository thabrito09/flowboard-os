import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import Confetti from './confetti';

interface FirstMissionPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function FirstMissionPopup({ show, onClose }: FirstMissionPopupProps) {
  const { userData } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  // Get level-based gradient
  const getGradient = () => {
    if (!userData) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 3) return 'from-[#E44332] to-[#FF8B3D]';
    if (userData.level <= 6) return 'from-purple-500 to-indigo-500';
    return 'from-amber-400 to-yellow-300';
  };
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <Dialog open={show} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md border-none bg-gradient-to-br from-background to-muted/50 shadow-xl">
          <div className="flex flex-col items-center text-center space-y-6 py-6">
            {/* XP Badge */}
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              "bg-gradient-to-br shadow-inner animate-in zoom-in-50 duration-500",
              getGradient()
            )}>
              <div className="flex items-center gap-1 text-white font-bold">
                <Star className="h-6 w-6" />
                <span className="text-xl">50</span>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-2 animate-in fade-in-50 duration-500 delay-200">
              <h2 className="text-2xl font-bold tracking-tight">
                🎉 Parabéns, {userData?.name}!
              </h2>
              <p className="text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent animate-pulse">
                Você acaba de ganhar seus primeiros 50XP! 🚀
              </p>
            </div>
            
            {/* Message */}
            <div className="space-y-2 text-muted-foreground animate-in fade-in-50 duration-500 delay-300">
              <p>
                Cada pequena ação te aproxima da sua versão mais lendária.
              </p>
              <p>
                Continue nessa jornada épica — o mundo é seu!
              </p>
            </div>
            
            {/* Button */}
            <Button
              onClick={onClose}
              className={cn(
                "w-full sm:w-auto px-8 text-white animate-in fade-in-50 duration-500 delay-500",
                "bg-gradient-to-r shadow-lg hover:shadow-xl transition-all",
                getGradient()
              )}
            >
              Continuar Evoluindo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}